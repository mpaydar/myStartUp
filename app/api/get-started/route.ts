import { NextResponse } from "next/server";

import {
  isGetStartedBusinessType,
  normalizePhoneToE164,
} from "@/lib/getStartedTypes";
import { getPricingTierByPlanId } from "@/lib/pricingTiers";
import { getNotificationEmailConfig } from "@/lib/sendContactNotification";
import {
  getGetStartedTwilioConfig,
  sendGetStartedOwnerEmail,
  sendGetStartedSms,
  sendGetStartedUserEmail,
} from "@/lib/sendGetStartedNotifications";

export const runtime = "nodejs";

const MAX_FIELD = 120;

function clamp(s: string, max: number): string {
  return s.trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const firstName = clamp(String(o.firstName ?? ""), 80);
  const businessName = clamp(String(o.businessName ?? ""), MAX_FIELD);
  const phoneRaw = String(o.phone ?? "").trim();
  const email = clamp(String(o.email ?? ""), 254).toLowerCase();
  const businessType = String(o.businessType ?? "").trim();
  const googleBusinessUrlRaw = String(o.googleBusinessUrl ?? "").trim();
  const planId = String(o.planId ?? "").toLowerCase().trim();

  if (!firstName || !businessName) {
    return NextResponse.json(
      { error: "First name and business name are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 },
    );
  }

  const phoneE164 = normalizePhoneToE164(phoneRaw);
  if (!phoneE164) {
    return NextResponse.json(
      {
        error:
          "Enter a valid mobile number (10 digits for US, or start with + and country code).",
      },
      { status: 400 },
    );
  }

  if (!isGetStartedBusinessType(businessType)) {
    return NextResponse.json({ error: "Invalid business type." }, { status: 400 });
  }

  const tier = getPricingTierByPlanId(planId);
  if (!tier) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  const googleBusinessUrl =
    googleBusinessUrlRaw.length > 0
      ? googleBusinessUrlRaw.slice(0, 2000)
      : null;

  const mailConfig = getNotificationEmailConfig();
  if (!mailConfig) {
    return NextResponse.json(
      {
        error:
          "Email is not configured. Set RESEND_API_KEY and NOTIFICATION_TO_EMAIL.",
      },
      { status: 503 },
    );
  }

  const payload = {
    firstName,
    businessName,
    phoneE164,
    phoneDisplay: phoneRaw.slice(0, 40),
    email,
    businessType,
    googleBusinessUrl,
    planId: tier.id,
    planName: tier.name,
    planPrice: tier.price,
  };

  try {
    await sendGetStartedUserEmail({
      apiKey: mailConfig.apiKey,
      from: mailConfig.from,
      to: email,
      payload,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("get-started user email failed:", err);
    return NextResponse.json(
      { error: `Could not send confirmation email: ${msg}` },
      { status: 502 },
    );
  }

  const twilioConfig = getGetStartedTwilioConfig();
  let smsSent = false;
  if (twilioConfig) {
    try {
      await sendGetStartedSms({
        twilio: twilioConfig,
        toE164: phoneE164,
        payload,
      });
      smsSent = true;
    } catch (err) {
      console.error("get-started SMS failed:", err);
    }
  }

  try {
    await sendGetStartedOwnerEmail({
      apiKey: mailConfig.apiKey,
      from: mailConfig.from,
      to: mailConfig.to,
      replyTo: email,
      payload,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("get-started owner email failed:", err);
    return NextResponse.json(
      {
        ok: false,
        emailToUserSent: true,
        smsSent,
        emailToOwnerSent: false,
        error: `We emailed you, but notifying our team failed: ${msg}`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    emailToUserSent: true,
    emailToOwnerSent: true,
    smsSent,
    smsSkipped: !smsSent && !twilioConfig,
    smsFailed: !smsSent && Boolean(twilioConfig),
  });
}
