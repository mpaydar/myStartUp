/**
 * Local review-management landing copy. Edit values here (one place).
 */
export const siteMarketing = {
  brand: "SimBay AI",
  /** Short geography for badges, hero, trust lines (e.g. nav, pills). */
  serviceRegionShort: "NJ & NY",
  /** Long form for SEO titles, body copy, and metadata. */
  serviceRegionLong: "New Jersey and New York",
  /** Used in title / SEO (short list). */
  verticalsTitle: "Salons, HVAC & Restaurants",
  /** Natural phrasing in body copy. */
  verticalsBody: "salons, HVAC contractors, and restaurants",
  contactEmail: "moe@simbayai.tech",
  /** Set when you want a literal phone in the footer; otherwise omitted in UI. */
  phoneDisplay: "917-434-3777",
/**
 * Optional override for the “Text me directly” button on /get_in_touch.
 * If empty, the same digits from `phoneDisplay` are used for an `sms:` link when possible.
 * Example: `sms:+12035550100` or `sms:+12035550100&body=Hi%20SimBay`
 * If both this and `phoneDisplay` are empty, the contact page still shows the block
 * but uses a prefilled mailto until you add a number.
 */
  textDirectSmsHref: "" as string,
  /** Label for the SMS button; defaults to `Text {phoneDisplay}` when href is inferred. */
  textDirectButtonLabel: "Send a text",
  /** Example social proof — replace with a real client when you have one. */
  resultsQuote:
    "Went from 12 to 47 Google reviews in 60 days.",
  resultsAttribution: "— Maria, owner, Glow Salon, Norwood CT",
  /** Must match the story in `resultsQuote` (drives animated counters). */
  resultsStartCount: 12,
  resultsEndCount: 47,
  resultsDays: 60,
} as const;

/** Single line for footer and about (no trailing punctuation). */
export function serviceAreaLine() {
  return siteMarketing.serviceRegionLong;
}

/** SMS CTA for contact page: explicit href, else digits from `phoneDisplay`. */
export function getTextDirectSmsCta():
  | { href: string; label: string; displayPhone: string }
  | null {
  const explicit = siteMarketing.textDirectSmsHref.trim();
  const labelOverride = siteMarketing.textDirectButtonLabel.trim();
  const phoneRaw = siteMarketing.phoneDisplay.trim();
  if (explicit) {
    return {
      href: explicit,
      label: labelOverride || "Text us",
      displayPhone: phoneRaw,
    };
  }
  const phone = phoneRaw;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const e164 =
    digits.length === 11 && digits.startsWith("1")
      ? digits
      : digits.length === 10
        ? `1${digits}`
        : digits;
  return {
    href: `sms:+${e164}`,
    label: labelOverride || `Text ${phone}`,
    displayPhone: phone,
  };
}

/**
 * Always returns a primary action for the “skip the form” block on /get_in_touch:
 * SMS when `textDirectSmsHref` or `phoneDisplay` is set; otherwise a prefilled mailto.
 */
export function getContactDirectCta(): {
  href: string;
  label: string;
  mode: "sms" | "email";
  displayPhone?: string;
} {
  const sms = getTextDirectSmsCta();
  if (sms) {
    const { displayPhone, ...rest } = sms;
    return {
      ...rest,
      mode: "sms" as const,
      ...(displayPhone ? { displayPhone } : {}),
    };
  }
  const email = siteMarketing.contactEmail.trim();
  const subject = encodeURIComponent("SimBay — quick question");
  const body = encodeURIComponent(
    "Hi — I'm interested in SimBay. (Sent from your contact page.)\n\n",
  );
  return {
    href: `mailto:${email}?subject=${subject}&body=${body}`,
    label: "Send a quick email",
    mode: "email" as const,
  };
}
