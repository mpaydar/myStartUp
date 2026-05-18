import { AI_API_CONTACT_INTEREST_ID } from "@/lib/aiApiServices";
import type { PricingTier } from "@/lib/pricingTypes";

const contactHref = `/get_in_touch?interest=${AI_API_CONTACT_INTEREST_ID}`;

/** AI & API integration — project + monthly care pricing. */
export const aiApiPricingTiers: PricingTier[] = [
  {
    id: "ai-starter",
    name: "Starter",
    price: 500,
    pricePeriod: "project",
    tagline: "Simple integration, one-time project",
    service: "ai",
    features: [
      { text: "One API or tool connection", included: true },
      { text: "Basic AI chatbot or FAQ flow", included: true },
      { text: "Up to 2 automated workflows", included: true },
      { text: "Stripe, Square, Google, or Twilio hookup", included: false },
      { text: "Ongoing monitoring & tweaks", included: false },
      { text: "Custom AI features (reports, alerts)", included: false },
    ],
    cta: "Request a quote",
    ctaStyle: "outline",
    href: contactHref,
  },
  {
    id: "ai-growth",
    name: "Growth",
    price: 99,
    pricePeriod: "month",
    tagline: "Automations live + monthly care",
    service: "ai",
    highlight: true,
    features: [
      { text: "AI chatbot trained on your business", included: true },
      { text: "Up to 3 API integrations", included: true },
      { text: "Workflow automation (texts, reminders, invoices)", included: true },
      { text: "Appointment & lead capture flows", included: true },
      { text: "2 automation updates / month", included: true },
      { text: "Custom AI features & predictive alerts", included: false },
    ],
    cta: "Get started",
    ctaStyle: "outline",
  },
  {
    id: "ai-pro",
    name: "Pro",
    price: 0,
    pricePeriod: "quote",
    tagline: "Custom builds quoted per scope",
    service: "ai",
    features: [
      { text: "Unlimited pages / complex workflows", included: true },
      { text: "Full API & POS / CRM / booking stack", included: true },
      { text: "Custom AI reports & segmentation", included: true },
      { text: "Predictive no-show & ops alerts", included: true },
      { text: "Priority support & fast turnaround", included: true },
      { text: "No retainer required to start", included: true },
    ],
    cta: "Tell me what you want to automate",
    ctaStyle: "outline",
    href: contactHref,
  },
];

export function getDefaultAiApiPricingTier(): PricingTier {
  return aiApiPricingTiers.find((t) => t.highlight) ?? aiApiPricingTiers[1] ?? aiApiPricingTiers[0];
}
