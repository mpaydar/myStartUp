import { Resend } from "resend";

export type NotificationEmailConfig = {
  apiKey: string;
  to: string;
  from: string;
};

export function getNotificationEmailConfig(): NotificationEmailConfig | null {
  const apiKey =
    process.env.RESEND_API_KEY?.trim() ||
    process.env.resend_api_key?.trim() ||
    "";
  const to =
    process.env.NOTIFICATION_TO_EMAIL?.trim() ||
    process.env.notification_to_email?.trim() ||
    "";
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.resend_from_email?.trim() ||
    "SimBay AI <onboarding@resend.dev>";

  if (!apiKey || !to) return null;
  return { apiKey, to, from };
}

export async function sendContactSubmissionEmail(options: {
  apiKey: string;
  to: string;
  from: string;
  replyTo: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  meetingAt: Date;
  fileName: string;
  fileBlobUrl: string;
  /** Same bytes stored in Azure — attached so you get a copy in your inbox. */
  fileBuffer: Buffer;
  fileContentType: string;
}): Promise<void> {
  const resend = new Resend(options.apiKey);
  const meetingLabel = options.meetingAt.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const href = encodeURI(options.fileBlobUrl);

  const fullName = `${options.firstName} ${options.lastName}`.trim();

  const { error } = await resend.emails.send({
    from: options.from,
    to: options.to,
    replyTo: options.replyTo,
    subject: `Recorded: ${fullName} — meeting ${meetingLabel}`,
    html: `
      <h2>New consultation recorded</h2>
      <p><strong>${escapeHtml(fullName)}</strong> has submitted a request and their appointment details are on file.</p>
      <p><strong>Their email (reply-to):</strong> ${escapeHtml(options.email)}</p>
      <p><strong>Requested meeting:</strong> ${escapeHtml(meetingLabel)}</p>
      <p><strong>What they need:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(options.message)}</p>
      <p><strong>Supporting file name:</strong> ${escapeHtml(options.fileName)}</p>
      <p><strong>File in Azure Blob:</strong> <a href="${href}">${escapeHtml(options.fileBlobUrl)}</a></p>
      <p><em>The same document is attached to this message.</em></p>
    `,
    attachments: [
      {
        filename: options.fileName,
        content: options.fileBuffer,
        contentType: options.fileContentType,
      },
    ],
  });

  if (error) {
    throw new Error(error.message);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
