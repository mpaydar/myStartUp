import { NextResponse } from "next/server";

import { isAllowedContactFileMeta } from "@/lib/contactDocument";
import { isMeetingSlotBooked } from "@/lib/bookedMeetingSlots";
import {
  isAllowedMeetingTime,
  MEETING_SCHEDULE_ERROR,
} from "@/lib/meetingSchedule";
import {
  isAllowedContactBlobReference,
  isAzureBlobConfigured,
} from "@/lib/azureBlob";
import { getPrisma } from "@/lib/prisma";
import {
  isRecaptchaConfigured,
  verifyRecaptchaToken,
} from "@/lib/recaptcha";
import {
  getNotificationEmailConfig,
  sendContactSubmissionEmail,
} from "@/lib/sendContactNotification";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 4000;
const MIN_MESSAGE_LENGTH = 20;

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form submission." },
      { status: 400 },
    );
  }

  if (!isRecaptchaConfigured()) {
    console.error("reCAPTCHA is not configured");
    return NextResponse.json(
      { error: "The contact form is not available right now." },
      { status: 503 },
    );
  }

  const recaptchaToken = String(formData.get("recaptchaToken") ?? "").trim();
  const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
  if (!recaptchaResult.ok) {
    return NextResponse.json({ error: recaptchaResult.error }, { status: 400 });
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const meetingAtRaw = String(formData.get("meetingAt") ?? "").trim();
  const meetingTime = String(formData.get("meetingTime") ?? "").trim();
  const fileName = String(formData.get("fileName") ?? "").trim();
  const fileBlobUrl = String(formData.get("fileBlobUrl") ?? "").trim();
  const fileBlobName = String(formData.get("fileBlobName") ?? "").trim();
  const fileMimeTypeRaw = String(formData.get("fileMimeType") ?? "").trim();
  const fileMimeType = fileMimeTypeRaw || null;
  const fileSizeRaw = formData.get("fileSize");
  const fileSizeParsed =
    fileSizeRaw === null || fileSizeRaw === undefined || String(fileSizeRaw) === ""
      ? NaN
      : Number(fileSizeRaw);

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "First and last name are required." },
      { status: 400 },
    );
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 },
    );
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    return NextResponse.json(
      {
        error: `Please describe what you need in at least ${MIN_MESSAGE_LENGTH} characters.`,
      },
      { status: 400 },
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      {
        error: `Your description is too long (max ${MAX_MESSAGE_LENGTH} characters).`,
      },
      { status: 400 },
    );
  }

  if (!meetingAtRaw || !meetingTime) {
    return NextResponse.json(
      { error: "Please choose a date and time for your meeting." },
      { status: 400 },
    );
  }

  if (!isAllowedMeetingTime(meetingTime)) {
    return NextResponse.json({ error: MEETING_SCHEDULE_ERROR }, { status: 400 });
  }

  const meetingAt = new Date(meetingAtRaw);
  if (Number.isNaN(meetingAt.getTime())) {
    return NextResponse.json(
      { error: "Invalid meeting date or time." },
      { status: 400 },
    );
  }

  const soonest = Date.now() - 60_000;
  if (meetingAt.getTime() < soonest) {
    return NextResponse.json(
      { error: "Please choose a meeting time in the future." },
      { status: 400 },
    );
  }

  if (await isMeetingSlotBooked(meetingAt)) {
    return NextResponse.json(
      { error: "That meeting time was just booked. Please choose another slot." },
      { status: 409 },
    );
  }

  const hasAllFileParts =
    Boolean(fileName) &&
    Boolean(fileBlobUrl) &&
    Boolean(fileBlobName) &&
    Number.isFinite(fileSizeParsed) &&
    fileSizeParsed > 0;

  const hasAnyFilePart =
    Boolean(fileName) ||
    Boolean(fileBlobUrl) ||
    Boolean(fileBlobName) ||
    (Number.isFinite(fileSizeParsed) && fileSizeParsed > 0);

  if (hasAnyFilePart && !hasAllFileParts) {
    return NextResponse.json(
      {
        error:
          "File upload was incomplete. Remove the file or finish uploading it.",
      },
      { status: 400 },
    );
  }

  if (hasAllFileParts) {
    if (
      !isAllowedContactFileMeta({
        fileName,
        fileSize: fileSizeParsed,
        contentType: fileMimeType,
      })
    ) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Use PDF, Word, plain text, or an image (PNG, JPEG, WebP).",
        },
        { status: 400 },
      );
    }

    if (!isAzureBlobConfigured()) {
      console.error(
        "Azure storage not configured: set AZURE_STORAGE_CONNECTION_STRING, or AZURE_STORAGE_ACCOUNT_NAME + azure_secret_key (account key).",
      );
      return NextResponse.json(
        {
          error:
            "File storage is not configured. Remove the attachment or set AZURE_STORAGE_CONNECTION_STRING (or account name + key).",
        },
        { status: 503 },
      );
    }

    if (
      !isAllowedContactBlobReference({
        blobUrl: fileBlobUrl,
        blobName: fileBlobName,
      })
    ) {
      return NextResponse.json(
        { error: "Invalid file reference for this submission." },
        { status: 400 },
      );
    }
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return NextResponse.json(
      { error: "Server is not configured to save submissions yet." },
      { status: 503 },
    );
  }

  const mailConfig = getNotificationEmailConfig();
  if (!mailConfig) {
    const missing: string[] = [];
    if (
      !process.env.RESEND_API_KEY?.trim() &&
      !process.env.resend_api_key?.trim()
    ) {
      missing.push("RESEND_API_KEY or resend_api_key");
    }
    if (
      !process.env.NOTIFICATION_TO_EMAIL?.trim() &&
      !process.env.notification_to_email?.trim()
    ) {
      missing.push("NOTIFICATION_TO_EMAIL (or notification_to_email)");
    }
    return NextResponse.json(
      {
        error: `Email notifications are not configured. Add to .env: ${missing.join(", ")}.`,
      },
      { status: 503 },
    );
  }

  const fileNameDb = hasAllFileParts ? fileName : null;
  const fileMimeTypeDb = hasAllFileParts ? fileMimeType : null;
  const fileSizeDb = hasAllFileParts ? fileSizeParsed : null;
  const fileBlobUrlDb = hasAllFileParts ? fileBlobUrl : null;

  try {
    await getPrisma().contactRequest.create({
      data: {
        firstName,
        lastName,
        email,
        message,
        meetingAt,
        fileName: fileNameDb,
        fileMimeType: fileMimeTypeDb,
        fileSize: fileSizeDb,
        fileBlobUrl: fileBlobUrlDb,
      },
    });
  } catch (err) {
    console.error("ContactRequest create failed:", err);
    return NextResponse.json(
      { error: "Could not save your submission to the database." },
      { status: 500 },
    );
  }

  try {
    await sendContactSubmissionEmail({
      apiKey: mailConfig.apiKey,
      to: mailConfig.to,
      from: mailConfig.from,
      replyTo: email,
      firstName,
      lastName,
      email,
      message,
      meetingAt,
      fileName: fileNameDb,
      fileBlobUrl: fileBlobUrlDb,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Resend notification failed (DB already saved):", err);
    return NextResponse.json(
      {
        ok: false,
        emailSent: false,
        databaseSaved: true,
        error: `Your request was recorded, but the notification email failed: ${msg}`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    emailSent: true,
    message:
      "Your message has been successfully recorded. I will meet with you at the time you selected and follow up by email if anything changes.",
  });
}
