import { NextResponse } from "next/server";

import {
  isAllowedContactFileMeta,
  MAX_CONTACT_FILE_BYTES,
} from "@/lib/contactDocument";
import {
  createContactDocumentUploadTarget,
  isAzureBlobConfigured,
} from "@/lib/azureBlob";
import {
  isRecaptchaConfigured,
  verifyRecaptchaToken,
} from "@/lib/recaptcha";

export const runtime = "nodejs";

type UploadUrlBody = {
  recaptchaToken?: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string | null;
};

export async function POST(request: Request) {
  if (!isRecaptchaConfigured()) {
    return NextResponse.json(
      { error: "The contact form is not available right now." },
      { status: 503 },
    );
  }

  if (!isAzureBlobConfigured()) {
    return NextResponse.json(
      { error: "File storage is not configured." },
      { status: 503 },
    );
  }

  let body: UploadUrlBody;
  try {
    body = (await request.json()) as UploadUrlBody;
  } catch {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  }

  const recaptchaToken = String(body.recaptchaToken ?? "").trim();
  const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
  if (!recaptchaResult.ok) {
    return NextResponse.json({ error: recaptchaResult.error }, { status: 400 });
  }

  const fileName = String(body.fileName ?? "").trim();
  const fileSize = Number(body.fileSize);
  const contentType =
    body.contentType === null || body.contentType === undefined
      ? null
      : String(body.contentType).trim() || null;

  if (!isAllowedContactFileMeta({ fileName, fileSize, contentType })) {
    return NextResponse.json(
      {
        error:
          "Unsupported file or file too large. Use PDF, Word, plain text, or an image up to 15 MB.",
      },
      { status: 400 },
    );
  }

  if (fileSize > MAX_CONTACT_FILE_BYTES) {
    return NextResponse.json(
      { error: "File is too large (max 15 MB)." },
      { status: 413 },
    );
  }

  try {
    const target = await createContactDocumentUploadTarget({
      originalFileName: fileName,
      contentType,
    });

    return NextResponse.json({
      uploadUrl: target.uploadUrl,
      blobUrl: target.blobUrl,
      blobName: target.blobName,
    });
  } catch (err) {
    console.error("Azure upload URL generation failed:", err);
    return NextResponse.json(
      { error: "Could not prepare file upload. Check storage configuration." },
      { status: 502 },
    );
  }
}
