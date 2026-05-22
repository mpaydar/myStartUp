/** freeLenser platform · SiliconLens — hardware flipping co-pilot */
export const siliconLensMarketing = {
  platformName: "freeLenser",
  productName: "SiliconLens",
  tagline:
    "The computer vision & LLM-powered co-pilot for secondary market hardware flippers.",
  shortDescription:
    "Multi-modal sourcing for PC refurbishers, e-waste recyclers, and hardware flippers—find underpriced GPUs and parts buried in chaotic eBay listings.",
  liveAppUrl: "/#siliconlens",
  productOrder: 2 as const,
} as const;

export const siliconLensScreens = [
  {
    id: "extension",
    src: "/freelenser-ebay-extension.png",
    alt: "SiliconLens Chrome extension on eBay with BUY profit badges on ThinkPad listings",
    eyebrow: "Augmented reality extension",
    caption:
      "Predict-and-cache pipeline injects native status bars: Evaluating profit → BUY! Click to view Profit Plan, or DON'T BUY — Low Margin. Hover tooltips in 0ms.",
  },
  {
    id: "dashboard",
    src: "/freelenser-dashboard.png",
    alt: "freeLenser sourcing dashboard with eBay laptop target and budget filters",
    eyebrow: "Centralized sourcing dashboard",
    caption:
      "Next.js command center pools highest-ROI deals from open tabs—target, budget filters, and ranked recommendations via WebSockets.",
  },
] as const;

export const siliconLensHowItWorks = [
  {
    step: "1",
    title: "Browse eBay with the extension",
    body: "Scroll listings as SiliconLens evaluates profit in the background—green BUY badges and gray pass indicators appear on each card.",
  },
  {
    step: "2",
    title: "Deals stream to freeLenser",
    body: "High-margin finds dispatch through low-latency microservices into your dashboard, ranked by real-time margin projections.",
  },
  {
    step: "3",
    title: "Open the repair playbook",
    body: "Click any deal for a prescriptive refurbishment blueprint—repair costs, resale values, and step-by-step diagnostics from RAG + Gemini.",
  },
] as const;

export const siliconLensTechStack = [
  {
    name: "High-speed ingestion",
    deploy: "Go",
    detail:
      "Network-optimized concurrent page polling with instant coarse filtering—no fragile browser bots.",
  },
  {
    name: "Semantic parsing",
    deploy: "FastAPI + SpaCy",
    detail:
      "NLP digests dirty listing text—VRAM variants, error behaviors, condition entities—from unstructured eBay copy.",
  },
  {
    name: "Visual inspection",
    deploy: "YOLO",
    detail:
      "Computer vision on thumbnails flags counterfeit shrouds, mining oxidation, and capacitor damage.",
  },
  {
    name: "Flipping manual",
    deploy: "RAG + Gemini",
    detail:
      "Retrieval-augmented repair costs and live resale values produce bulletproof refurbishment playbooks.",
  },
] as const;

export const siliconLensFeatures = [
  {
    id: "extension-ar",
    title: "AR extension",
    description: "BUY / DON'T BUY bars flush on listing cards—hover diagnostics at cursor.",
    href: "/#siliconlens",
    accent: "emerald" as const,
    symbol: "⬡",
  },
  {
    id: "spacy-parse",
    title: "SpaCy parsing",
    description: "Extract hidden clues from messy seller descriptions—not barcode scanners.",
    href: "/#siliconlens-tech",
    accent: "emerald" as const,
    symbol: "⌁",
  },
  {
    id: "yolo-vision",
    title: "YOLO vision",
    description: "Cross-verify photos for damage, fakes, and wear before you bid.",
    href: "/#siliconlens-tech",
    accent: "teal" as const,
    symbol: "◎",
  },
  {
    id: "dashboard",
    title: "freeLenser hub",
    description: "Aggregate pipeline + budget filters + prescriptive action plans.",
    href: "/#siliconlens",
    accent: "teal" as const,
    symbol: "▦",
  },
] as const;
