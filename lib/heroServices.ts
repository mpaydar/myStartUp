/** Homepage hero — services with anchor links and accent colors. */
export const heroServices = [
  {
    id: "reviews",
    title: "Review management",
    description: "Automated Google review requests & AI-assisted replies.",
    href: "/#reviews",
    accent: "teal" as const,
    symbol: "★",
  },
  {
    id: "crm",
    title: "CRM & leads",
    description: "Capture, track, and follow up with every customer.",
    href: "/#crm",
    accent: "teal" as const,
    symbol: "◎",
  },
  {
    id: "insights",
    title: "Business insights",
    description: "Ratings trends, reports, and what customers are saying.",
    href: "/#insights",
    accent: "teal" as const,
    symbol: "▦",
  },
  {
    id: "social",
    title: "Social content",
    description: "Posts and campaigns without hiring an agency.",
    href: "/#social",
    accent: "teal" as const,
    symbol: "✦",
  },
  {
    id: "web",
    title: "Websites",
    description: "Landing pages to full sites — free starter to pro care.",
    href: "/#web-apps",
    accent: "violet" as const,
    symbol: "◫",
  },
  {
    id: "ai-api",
    title: "AI & API integration",
    description: "Chatbots, automations, and tools that talk to each other.",
    href: "/#ai-api",
    accent: "sky" as const,
    symbol: "⚡",
  },
] as const;

export type HeroServiceAccent = (typeof heroServices)[number]["accent"];
