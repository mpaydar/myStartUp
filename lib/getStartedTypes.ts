/** Shared with `GetStartedClient` and `POST /api/get-started` (no `"use client"`). */
export const GET_STARTED_BUSINESS_TYPES = [
  "Hair salon",
  "Barbershop",
  "Nail salon",
  "Restaurant",
  "HVAC / trades",
  "Gym",
  "Other",
] as const;

export type GetStartedBusinessType = (typeof GET_STARTED_BUSINESS_TYPES)[number];

export function isGetStartedBusinessType(
  v: string,
): v is GetStartedBusinessType {
  return (GET_STARTED_BUSINESS_TYPES as readonly string[]).includes(v);
}

/** Best-effort E.164 for US and + international numbers. */
export function normalizePhoneToE164(input: string): string | null {
  const trimmed = input.trim();
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) {
    const d = trimmed.slice(1).replace(/\D/g, "");
    if (d.length >= 8 && d.length <= 15) return `+${d}`;
    return null;
  }
  if (digitsOnly.length === 10) return `+1${digitsOnly}`;
  if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    return `+${digitsOnly}`;
  }
  return null;
}
