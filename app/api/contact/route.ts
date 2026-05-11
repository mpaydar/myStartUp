import { NextResponse } from "next/server";

import {
  isAzureBlobConfigured,
  uploadContactDocumentToAzure,
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

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_MESSAGE_LENGTH = 4000;
const MIN_MESSAGE_LENGTH = 20;
const ALLOWED_EXT = new Set([
  "pdf",
  "doc",
  "docx",
  "txt",
  "png",
  "jpg",
  "jpeg",
  "webp",
]);
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

function isAllowedFile(file: File): boolean {
  if (ALLOWED_TYPES.has(file.type)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXT.has(ext)) return false;
  return !file.type || file.type === "application/octet-stream";
}

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
  const file = formData.get("document");

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

  if (!meetingAtRaw) {
    return NextResponse.json(
      { error: "Please choose a date and time for your meeting." },
      { status: 400 },
    );
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

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Please attach a supporting document." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "File is too large (max 15 MB)." },
      { status: 413 },
    );
  }

  if (!isAllowedFile(file)) {
    return NextResponse.json(
      {
        error:
          "Unsupported file type. Use PDF, Word, plain text, or an image (PNG, JPEG, WebP).",
      },
      { status: 400 },
    );
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return NextResponse.json(
      { error: "Server is not configured to save submissions yet." },
      { status: 503 },
    );
  }

  if (!isAzureBlobConfigured()) {
    console.error(
      "Azure storage not configured: set AZURE_STORAGE_CONNECTION_STRING, or AZURE_STORAGE_ACCOUNT_NAME + azure_secret_key (account key).",
    );
    return NextResponse.json(
      {
        error:
          "File storage is not configured. Set AZURE_STORAGE_CONNECTION_STRING or AZURE_STORAGE_ACCOUNT_NAME + azure_secret_key.",
      },
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

  const bytes = Buffer.from(await file.arrayBuffer());
  const fileContentType = file.type || "application/octet-stream";

  let fileBlobUrl: string;
  try {
    const uploaded = await uploadContactDocumentToAzure({
      buffer: bytes,
      originalFileName: file.name,
      contentType: file.type || null,
    });
    fileBlobUrl = uploaded.blobUrl;
  } catch (err) {
    console.error("Azure blob upload failed:", err);
    return NextResponse.json(
      { error: "Could not upload your document to Azure. Check storage configuration." },
      { status: 502 },
    );
  }

  try {
    await getPrisma().contactRequest.create({
      data: {
        firstName,
        lastName,
        email,
        message,
        meetingAt,
        fileName: file.name,
        fileMimeType: file.type || null,
        fileSize: file.size,
        fileBlobUrl,
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
      fileName: file.name,
      fileBlobUrl,
      fileBuffer: bytes,
      fileContentType,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Resend notification failed (blob + DB already saved):", err);
    return NextResponse.json(
      {
        ok: false,
        emailSent: false,
        storageSaved: true,
        databaseSaved: true,
        error: `Your file was saved to Azure and the request was recorded, but the notification email failed: ${msg}`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    emailSent: true,
    storageSaved: true,
    message:
      "Your message has been successfully recorded. I will meet with you at the time you selected and follow up by email if anything changes.",
  });
}
