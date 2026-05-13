import twilio from "twilio";

import { getNotificationEmailConfig } from "@/lib/sendContactNotification";
import { Resend } from "resend";

export type GetStartedTwilioConfig = {
  accountSid: string;
  authToken: string;
  fromNumber: string;
};

export function getGetStartedTwilioConfig(): GetStartedTwilioConfig | null {
  const accountSid =
    process.env.TWILIO_ACCOUNT_SID?.trim() ||
    process.env.twilio_sid?.trim() ||
    process.env.twilio_account_sid?.trim() ||
    "";
  const authToken =
    process.env.TWILIO_AUTH_TOKEN?.trim() ||
    process.env.twilio_secret?.trim() ||
    process.env.twilio_auth_token?.trim() ||
    "";
  const fromNumber =
    process.env.TWILIO_FROM_NUMBER?.trim() ||
    process.env.twilio_from_number?.trim() ||
    "";
  if (!accountSid || !authToken || !fromNumber) return null;
  return { accountSid, authToken, fromNumber };
}

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
  payload: GetStartedLeadPayload;
}): Promise<void> {
  const resend = new Resend(options.apiKey);
  const { firstName, businessName, planName, planPrice, phoneDisplay } =
    options.payload;
  const { error } = await resend.emails.send({
    from: options.from,
    to: options.to,
    subject: `You're in — SimBay (${planName}) for ${businessName}`,
    html: `
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>Thanks for choosing SimBay. We received your <strong>${escapeHtml(planName)}</strong> plan (${escapeHtml(String(planPrice))}/mo) for <strong>${escapeHtml(businessName)}</strong>.</p>
      <p>We&apos;ll text you at <strong>${escapeHtml(phoneDisplay)}</strong> to finish setup. If you don&apos;t hear from us within one business day, reply to this email.</p>
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

export async function sendGetStartedSms(options: {
  twilio: GetStartedTwilioConfig;
  toE164: string;
  payload: GetStartedLeadPayload;
}): Promise<void> {
  const { firstName, businessName, planName } = options.payload;
  const client = twilio(options.twilio.accountSid, options.twilio.authToken);
  const body = `Hi ${firstName} — SimBay here. We got your ${planName} signup for ${businessName}. We'll follow up shortly to finish setup. Reply STOP to opt out.`;
  const truncated =
    body.length > 1500 ? `${body.slice(0, 1490)}… (see email)` : body;
  await client.messages.create({
    body: truncated,
    from: options.twilio.fromNumber,
    to: options.toE164,
  });
}
