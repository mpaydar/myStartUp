/** CareerLens AI — aligned with https://github.com/mpaydar/CareerLensAI-_V2 */
export const careerLensMarketing = {
  productName: "CareerLens AI",
  liveViewName: "ResumeSnap",
  liveAppUrl: "https://career-lens-ai-v2.vercel.app/",
  githubUrl: "https://github.com/mpaydar/CareerLensAI-_V2",
  /** In-app dashboard tagline (see product screenshots). */
  dashboardTagline:
    "Highlight a job description, analyze skill gaps, and tailor your resume with AI.",
  tagline:
    "Highlight a job description, analyze skill gaps, and tailor your resume with AI.",
  shortDescription:
    "ResumeSnap dashboard plus Chrome extension, SpaCy gap analysis with context fit scores, and Gemini bullet & project optimization—built on the CareerLens AI platform.",
  freemiumNote:
    "Highlights and skill gap analysis are always free. Bullet optimization and project suggestions use 3 free AI actions per month.",
} as const;

export const careerLensProductScreens = [
  {
    id: "dashboard",
    src: "/careerlens-dashboard.png",
    alt: "ResumeSnap dashboard showing latest job highlight capture, applications detected, and AI actions remaining",
    eyebrow: "Live dashboard",
    caption:
      "Latest highlight syncs from LinkedIn via the extension. Easy Apply applications log automatically while the tab is open.",
  },
  {
    id: "gap-analysis",
    src: "/careerlens-gap-analysis.png",
    alt: "Skills gap analysis with keyword match, context fit, and four-column skill breakdown",
    eyebrow: "Analyze skills gap",
    caption:
      "Keyword lexical match, context fit scores, and columns for aligned, mismatch, in-JD-not-resume (with project clusters), and on-resume-only skills.",
  },
] as const;

export const careerLensStack = [
  {
    name: "Frontend",
    deploy: "Vercel",
    detail: "Next.js app, accounts (GitHub / Google), Upstash Redis, Gemini for resume bullets & projects",
  },
  {
    name: "LLM layer",
    deploy: "Cloud Run · Railway",
    detail: "SpaCy gap analysis, context fit, interview prep, Whisper transcription",
  },
  {
    name: "Chrome extension",
    deploy: "Manifest V3",
    detail: "Highlight job descriptions on LinkedIn and sync to your live dashboard",
  },
] as const;

export const careerLensFeatures = [
  {
    id: "highlights",
    title: "Latest highlight",
    description: "Capture JD text on LinkedIn or in-app; same job appends, new job replaces.",
    href: "/#preview",
    accent: "violet" as const,
    symbol: "◎",
  },
  {
    id: "easy-apply",
    title: "Applications detected",
    description: "LinkedIn Easy Apply flows log automatically while your dashboard is open.",
    href: "/#preview",
    accent: "violet" as const,
    symbol: "✓",
  },
  {
    id: "gap-analysis",
    title: "Skills gap",
    description: "Aligned, mismatch, in-JD-not-resume, and on-resume-only—with match % gauges.",
    href: "/#gap-analysis",
    accent: "sky" as const,
    symbol: "⌁",
  },
  {
    id: "clusters",
    title: "Project clusters",
    description: "Missing skills grouped by type—one portfolio path per cluster.",
    href: "/#gap-analysis",
    accent: "sky" as const,
    symbol: "▦",
  },
  {
    id: "optimize",
    title: "AI actions",
    description: "3 free monthly credits for bullet optimization and project suggestions.",
    href: "/#optimize",
    accent: "violet" as const,
    symbol: "✦",
  },
  {
    id: "live-view",
    title: "ResumeSnap",
    description: "Dark dashboard at career-lens-ai-v2.vercel.app—your application command center.",
    href: "/#preview",
    accent: "sky" as const,
    symbol: "◉",
  },
] as const;

export type CareerLensImageKey =
  | "extension"
  | "gapAnalysis"
  | "resume"
  | "liveView"
  | "optimize"
  | "interview";

export type CareerLensFeatureSection = {
  id: string;
  imageKey: CareerLensImageKey;
  h2: string;
  subheading: string;
  bullets: readonly [string, string, string];
  howItWorksLine: string;
  visualSymbol: string;
  reverse?: boolean;
  variant?: "white" | "muted";
  externalCta?: boolean;
};

export const careerLensFeatureSections: CareerLensFeatureSection[] = [
  {
    id: "extension",
    imageKey: "extension",
    h2: "Highlight job descriptions where you browse",
    subheading:
      "Select text on LinkedIn (extension) or on the dashboard page. Highlights sync to the Latest highlight box in seconds.",
    bullets: [
      "Same job appends with a separator; a new job replaces the capture box.",
      "Extension popup shows local capture; the dashboard shows what reached the server via Redis.",
      "Open the dashboard tab once, set your Vercel URL in extension Options, reload, then highlight again.",
    ],
    howItWorksLine:
      "Not syncing? Check the service worker console for [ResumeSnap] saved messages—or use production URL, not a protected preview deployment.",
    visualSymbol: "◎",
    variant: "white",
  },
  {
    id: "gap-analysis",
    imageKey: "gapAnalysis",
    h2: "Analyze skills gap—four columns, real scores",
    subheading:
      "Hit Analyze skills gap to compare your resume to the latest highlight with SpaCy—not just keyword overlap.",
    bullets: [
      "Keyword lexical match and context same setting gauges, plus context fit, mismatch, and gap counts.",
      "Context aligned (purple), context mismatch (pink—hover to reframe), in JD not resume (orange clusters), on resume only (blue).",
      "Build projects for cluster turns missing skill groups into portfolio paths—e.g. Next.js, React, TypeScript, Node.js together.",
    ],
    howItWorksLine:
      "Gap analysis runs on the llm_layer; highlights stay free while Gemini optimization uses your monthly AI action credits.",
    visualSymbol: "⌁",
    reverse: true,
    variant: "muted",
  },
  {
    id: "optimize",
    imageKey: "optimize",
    h2: "3 free AI actions for bullets & projects",
    subheading:
      "The purple banner tracks remaining credits for bullet optimization and project suggestions.",
    bullets: [
      "Hi [name] — you have 3 of 3 free AI actions left (resets on the 30-day window).",
      "Optimize context to reframe mismatch bullets; project suggestions cover in-JD-not-resume clusters.",
      "View plans when credits run out—highlights and skill gap analysis never count against the limit.",
    ],
    howItWorksLine:
      "Use gap results first (free), then spend AI actions only on the rewrites and portfolio ideas that close real gaps.",
    visualSymbol: "✦",
    variant: "white",
  },
  {
    id: "resume",
    imageKey: "resume",
    h2: "Sign in, upload resume, track applications",
    subheading:
      "GitHub or Google OAuth, onboarding with name + PDF/DOCX upload, and Easy Apply logging on LinkedIn.",
    bullets: [
      "Applications detected: when you finish LinkedIn Easy Apply (form fields → Submit), we log it with the extension heuristic.",
      "No applications yet? Complete an Easy Apply flow while this dashboard tab is open.",
      "Parsed resume powers every gap run and optimization against your latest highlight.",
    ],
    howItWorksLine:
      "Your master resume and session live in Redis—returning users pick up where they left off on the live dashboard.",
    visualSymbol: "▤",
    reverse: true,
    variant: "muted",
  },
];

export const careerLensHowItWorks = [
  {
    step: "1",
    title: "Open ResumeSnap & highlight the JD",
    body: "Sign in, upload your resume, and capture the job description—from LinkedIn via extension or directly on the page.",
  },
  {
    step: "2",
    title: "Analyze skills gap",
    body: "See aligned, mismatch, missing, and resume-only skills—with lexical and context fit scores and project clusters.",
  },
  {
    step: "3",
    title: "Optimize & apply",
    body: "Spend AI actions on bullet rewrites and project ideas, log Easy Apply submissions, and iterate for the next role.",
  },
] as const;
