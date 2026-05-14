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
  /** Must be an address on a domain you verified in Resend (required to email customers, not only your inbox). */
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
  fileName: string | null;
  fileBlobUrl: string | null;
}): Promise<void> {
  const resend = new Resend(options.apiKey);
  const meetingLabel = options.meetingAt.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const fullName = `${options.firstName} ${options.lastName}`.trim();

  const fileSection =
    options.fileName && options.fileBlobUrl
      ? (() => {
          const href = encodeURI(options.fileBlobUrl);
          return `
      <p><strong>Supporting file name:</strong> ${escapeHtml(options.fileName)}</p>
      <p><strong>File in Azure Blob:</strong> <a href="${href}">${escapeHtml(options.fileBlobUrl)}</a></p>
      <p><em>Open the link above to download the uploaded document from Azure Blob Storage.</em></p>`;
        })()
      : `<p><em>No supporting file was attached.</em></p>`;

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
      ${fileSection}
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/** Confirmation to the person who submitted the contact form (uses your verified `from` domain). */
export async function sendCustomerContactConfirmationEmail(options: {
  apiKey: string;
  from: string;
  to: string;
  replyTo: string;
  firstName: string;
  meetingAt: Date;
  message: string;
}): Promise<void> {
  const resend = new Resend(options.apiKey);
  const meetingLabel = options.meetingAt.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });
  const preview =
    options.message.length > 2000
      ? `${options.message.slice(0, 2000)}…`
      : options.message;
  const { error } = await resend.emails.send({
    from: options.from,
    to: options.to,
    replyTo: options.replyTo,
    subject: "We received your request — SimBay AI",
    html: `
      <p>Hi ${escapeHtml(options.firstName)},</p>
      <p>Thanks for reaching out. This confirms we received your message and your requested time: <strong>${escapeHtml(meetingLabel)}</strong>.</p>
      <p>I&apos;ll meet with you then. If anything changes, reply to this email.</p>
      <p><strong>What you sent (for your records):</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(preview)}</p>
      <p>— SimBay AI</p>
    `,
  });
  if (error) throw new Error(error.message);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
