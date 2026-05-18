/** AI & API integration services — homepage section copy. */

export const AI_API_CONTACT_INTEREST_ID = "ai_api_integration";

export const aiApiServicesContent = {
  id: "ai-api",
  eyebrow: "AI & API integration",
  title: "AI & API integration",
  intro:
    "We connect your existing tools — your POS, booking system, CRM, or website — to AI and third-party APIs. Automations that used to cost $10,000+ to build are now within reach for any local business in NJ & NY.",
  services: [
    {
      number: 1,
      title: "AI Chatbots",
      description:
        "Custom chatbots trained on your business. Answers FAQs, books appointments, and captures leads 24/7 — even when you're closed.",
    },
    {
      number: 2,
      title: "API Integrations",
      description:
        "Connect your tools — Stripe, Square, Google, OpenAI, Twilio — so they talk to each other automatically. No more copy-pasting between apps.",
    },
    {
      number: 3,
      title: "Workflow Automation",
      description:
        "Repetitive tasks like follow-up texts, invoice sending, and appointment reminders run themselves. You focus on the work, not the admin.",
    },
    {
      number: 4,
      title: "Custom AI Features",
      description:
        "Need something specific? AI-generated reports, smart customer segmentation, predictive no-show alerts — built to fit your exact business.",
    },
  ] as const,
  pricingNote:
    "Projects start at $500 for simple integrations. Custom builds quoted per scope. No retainer required.",
  cta: {
    label: "Tell me what you want to automate",
    href: `/get_in_touch?interest=${AI_API_CONTACT_INTEREST_ID}`,
  },
  trustLine:
    "Local developer in Bergen County, NJ · You can text me directly · Fast turnaround",
} as const;
