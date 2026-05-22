/**
 * SimBay AI — designs and ships AI software solutions (SpaCy NLP at the core).
 */
export const siteMarketing = {
  brand: "SimBay AI",
  companyTagline: "Designing AI software solutions",
  companyDescription:
    "We design and build production AI software—custom platforms, extensions, and NLP services that turn messy real-world data into clear decisions. SpaCy-powered semantic analysis is our foundation; we layer dashboards, APIs, and multimodal AI where each problem requires it.",
  solutionsIntro:
    "Examples of AI solutions we've designed and shipped—not an exhaustive list of everything we build.",
  spacyHighlight:
    "SpaCy is our core NLP layer: custom taxonomies, PhraseMatcher, and context-fit scoring—not brittle keyword bots.",
  featuredSolutions: {
    careerLens: "CareerLens AI",
    siliconLens: "SiliconLens",
    freelenser: "freeLenser",
  },
  contactEmail: "moe@simbayai.tech",
  phoneDisplay: "917-434-3777",
  textDirectSmsHref: "" as string,
  textDirectButtonLabel: "Send a text",
} as const;

/** @deprecated Use featuredSolutions — kept for imports during transition */
export const firstProduct = siteMarketing.featuredSolutions.careerLens;
export const secondProduct = siteMarketing.featuredSolutions.siliconLens;
export const secondPlatform = siteMarketing.featuredSolutions.freelenser;

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
    "Hi — I'm interested in SimBay AI software solutions. (Sent from your contact page.)\n\n",
  );
  return {
    href: `mailto:${email}?subject=${subject}&body=${body}`,
    label: "Send a quick email",
    mode: "email" as const,
  };
}
