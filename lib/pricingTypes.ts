export type PricingFeature = { text: string; included: boolean };

export type PricingService = "reviews" | "web";

export type PricingTier = {
  id: string;
  name: string;
  /** Display price (0 for free one-time build). */
  price: number;
  /** Shown after price, e.g. "/mo". Omit for one-time $0 plans. */
  pricePeriod?: "month" | "none";
  tagline: string;
  features: PricingFeature[];
  cta: string;
  ctaStyle: "outline" | "solid";
  highlight?: boolean;
  service: PricingService;
};
