import type { PricingTier } from "@/lib/pricingTypes";

/** Web application / website build & care — payment model from product pricing. */
export const webAppPricingTiers: PricingTier[] = [
  {
    id: "web-starter",
    name: "Starter",
    price: 0,
    pricePeriod: "none",
    tagline: "One-time build, no fee",
    service: "web",
    features: [
      { text: "1-page landing site", included: true },
      { text: "Mobile responsive", included: true },
      { text: "Basic CMS", included: true },
      { text: "Custom domain setup", included: false },
      { text: "SEO optimization", included: false },
      { text: "Monthly updates", included: false },
    ],
    cta: "Request free site",
    ctaStyle: "outline",
  },
  {
    id: "web-growth",
    name: "Growth",
    price: 49,
    pricePeriod: "month",
    tagline: "Build free + monthly care",
    service: "web",
    highlight: true,
    features: [
      { text: "Up to 5 pages", included: true },
      { text: "Mobile responsive", included: true },
      { text: "Full CMS", included: true },
      { text: "Custom domain setup", included: true },
      { text: "SEO optimization", included: true },
      { text: "2 updates / month", included: true },
    ],
    cta: "Get started",
    ctaStyle: "outline",
  },
  {
    id: "web-pro",
    name: "Pro",
    price: 99,
    pricePeriod: "month",
    tagline: "Full-service web presence",
    service: "web",
    features: [
      { text: "Unlimited pages", included: true },
      { text: "Mobile responsive", included: true },
      { text: "Full CMS + blog", included: true },
      { text: "Custom domain setup", included: true },
      { text: "Advanced SEO", included: true },
      { text: "Unlimited updates", included: true },
    ],
    cta: "Get started",
    ctaStyle: "outline",
  },
];

export function getDefaultWebAppPricingTier(): PricingTier {
  return (
    webAppPricingTiers.find((t) => t.highlight) ?? webAppPricingTiers[1] ?? webAppPricingTiers[0]
  );
}
