import type { PricingTier } from "@/lib/pricingTypes";
import { webAppPricingTiers } from "@/lib/webAppPricingTiers";

export type { PricingFeature, PricingService, PricingTier } from "@/lib/pricingTypes";

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    pricePeriod: "month",
    tagline: "Perfect if you just want more Google reviews without the fuss.",
    service: "reviews",
    features: [
      { text: "Automated review SMS", included: true },
      { text: "AI-assisted review writing", included: true },
      { text: "Google review monitoring", included: true },
      { text: "Instant new review alerts", included: true },
      { text: "Up to 100 SMS / month", included: true },
      { text: "CRM & customer profiles", included: false },
      { text: "Monthly insight report", included: false },
      { text: "Photo & social media", included: false },
    ],
    cta: "Get started free",
    ctaStyle: "outline",
  },
  {
    id: "growth",
    name: "Growth",
    price: 119,
    pricePeriod: "month",
    tagline:
      "Reviews + intelligence. Know what customers think and what to do about it.",
    service: "reviews",
    features: [
      { text: "Everything in Starter", included: true },
      { text: "Unlimited SMS", included: true },
      { text: "CRM — full customer profiles", included: true },
      { text: "Lapsed customer alerts", included: true },
      { text: "Monthly AI insight report", included: true },
      { text: "Suggested actions dashboard", included: true },
      { text: "Competitor rating tracker", included: true },
      { text: "Photo credits & UGC", included: false },
    ],
    cta: "Start free month",
    ctaStyle: "solid",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 199,
    pricePeriod: "month",
    tagline:
      "The full stack. Reviews, insights, CRM, photos, and social — all on autopilot.",
    service: "reviews",
    features: [
      { text: "Everything in Growth", included: true },
      { text: "Photo credits system", included: true },
      { text: "AI-captioned content queue", included: true },
      { text: "1-tap Instagram & Facebook post", included: true },
      { text: "Google Business photo sync", included: true },
      { text: "Customer referral tracking", included: true },
      { text: "Priority text support", included: true },
      { text: "Quarterly strategy call", included: true },
    ],
    cta: "Get started free",
    ctaStyle: "outline",
  },
];

const allPricingTiers: PricingTier[] = [...pricingTiers, ...webAppPricingTiers];

export function getPricingTierByPlanId(
  planId: string | null | undefined,
): PricingTier | undefined {
  if (!planId) return undefined;
  const id = planId.toLowerCase().trim();
  return allPricingTiers.find((t) => t.id === id);
}

export function getDefaultPricingTier(): PricingTier {
  return pricingTiers.find((t) => t.highlight) ?? pricingTiers[1] ?? pricingTiers[0];
}
