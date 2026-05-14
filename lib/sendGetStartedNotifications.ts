import { getNotificationEmailConfig } from "@/lib/sendContactNotification";
import { Resend } from "resend";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type GetStartedLeadPayload = {
  firstName: string;
  businessName: string;
  phoneE164: string;
  phoneDisplay: string;
  email: string;
  businessType: string;
  googleBusinessUrl: string | null;
  planId: string;
  planName: string;
  planPrice: number;
};

export async function sendGetStartedUserEmail(options: {
  apiKey: string;
  from: string;
  to: string;
  replyTo: string;
  payload: GetStartedLeadPayload;
}): Promise<void> {
  const resend = new Resend(options.apiKey);
  const { firstName, businessName, planName, planPrice, phoneDisplay } =
    options.payload;
  const { error } = await resend.emails.send({
    from: options.from,
    to: options.to,
    replyTo: options.replyTo,
    subject: `You're in — SimBay (${planName}) for ${businessName}`,
    html: `
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>Thanks for choosing SimBay. We received your <strong>${escapeHtml(planName)}</strong> plan (${escapeHtml(String(planPrice))}/mo) for <strong>${escapeHtml(businessName)}</strong>.</p>
      <p>We have your number on file (<strong>${escapeHtml(phoneDisplay)}</strong>) and will reach out by <strong>email</strong> to finish setup. If you don&apos;t hear from us within one business day, reply to this message.</p>
      <p>— SimBay AI</p>
    `,
  });
  if (error) throw new Error(error.message);
}

export async function sendGetStartedOwnerEmail(options: {
  apiKey: string;
  from: string;
  to: string;
  replyTo: string;
  payload: GetStartedLeadPayload;
}): Promise<void> {
  const resend = new Resend(options.apiKey);
  const p = options.payload;
  const gbp = p.googleBusinessUrl
    ? `<p><strong>Google Business URL:</strong> <a href="${encodeURI(p.googleBusinessUrl)}">${escapeHtml(p.googleBusinessUrl)}</a></p>`
    : "<p><em>No Google Business URL provided.</em></p>";
  const { error } = await resend.emails.send({
    from: options.from,
    to: options.to,
    replyTo: options.replyTo,
    subject: `New get-started: ${p.businessName} — ${p.planName}`,
    html: `
      <h2>New Get Started submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(p.firstName)}</p>
      <p><strong>Business:</strong> ${escapeHtml(p.businessName)}</p>
      <p><strong>Phone (E.164):</strong> ${escapeHtml(p.phoneE164)}</p>
      <p><strong>Email:</strong> ${escapeHtml(p.email)}</p>
      <p><strong>Business type:</strong> ${escapeHtml(p.businessType)}</p>
      ${gbp}
      <p><strong>Plan:</strong> ${escapeHtml(p.planName)} (${escapeHtml(String(p.planPrice))}/mo) · id <code>${escapeHtml(p.planId)}</code></p>
    `,
  });
  if (error) throw new Error(error.message);
}
