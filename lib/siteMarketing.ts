/**
 * Company site copy — SimBay AI builds AI platforms; CareerLens AI is the first product.
 */
export const siteMarketing = {
  brand: "SimBay AI",
  companyTagline: "Building AI platforms for real-world work",
  flagshipProduct: "CareerLens AI",
  contactEmail: "moe@simbayai.tech",
  phoneDisplay: "917-434-3777",
  textDirectSmsHref: "" as string,
  textDirectButtonLabel: "Send a text",
} as const;

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
  const subject = encodeURIComponent("SimBay AI — quick question");
  const body = encodeURIComponent(
    "Hi — I'm interested in SimBay AI / CareerLens. (Sent from your contact page.)\n\n",
  );
  return {
    href: `mailto:${email}?subject=${subject}&body=${body}`,
    label: "Send a quick email",
    mode: "email" as const,
  };
}
