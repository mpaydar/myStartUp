export type PricingFeature = { text: string; included: boolean };

export type PricingService = "reviews" | "web" | "ai";

/** How the main price is shown on tier cards. */
export type PricePeriod = "month" | "none" | "project" | "quote";

export type PricingTier = {
  id: string;
  name: string;
  /** Display price (0 for free builds or when using `quote` period). */
  price: number;
  /** Controls price suffix and special displays (e.g. Custom quote). */
  pricePeriod?: PricePeriod;
  tagline: string;
  features: PricingFeature[];
  cta: string;
  ctaStyle: "outline" | "solid";
  highlight?: boolean;
  service: PricingService;
  /** Override default `/get_started?plan=…` CTA link. */
  href?: string;
};
