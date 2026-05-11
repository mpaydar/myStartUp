import Image from "next/image";

import { Reveal } from "./components/Reveal";
import { SiteHeader } from "./components/SiteHeader";

const services = [
  {
    title: "CI/CD integration",
    description:
      "Pipelines, release automation, quality gates, and observability so every deploy is predictable and reversible.",
    icon: "⟲",
    imageSrc:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=640&h=400&fit=crop&q=80",
    imageAlt: "Developer reviewing code on multiple monitors",
  },
  {
    title: "Web applications",
    description:
      "Production-grade frontends and full-stack apps: performance, accessibility, and maintainability from day one.",
    icon: "◇",
    imageSrc:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=400&fit=crop&q=80",
    imageAlt: "Laptop showing analytics dashboard",
  },
  {
    title: "AI agent development",
    description:
      "Agents that use your tools safely: planning, retrieval, structured outputs, and human-in-the-loop where it matters.",
    icon: "◆",
    imageSrc:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=400&fit=crop&q=80",
    imageAlt: "Abstract visualization suggesting AI and neural networks",
  },
  {
    title: "LLM tokenization & cost optimization",
    description:
      "Prompt design, caching, batching, and model routing to cut latency and spend without sacrificing quality.",
    icon: "⌁",
    imageSrc:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=640&h=400&fit=crop&q=80",
    imageAlt: "Programming workspace with code on screen",
  },
  {
    title: "Dockerization",
    description:
      "Multi-stage images, compose for local parity, hardened non-root runtimes, and CI that builds and scans containers.",
    icon: "▣",
    imageSrc:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=640&h=400&fit=crop&q=80",
    imageAlt: "Server room and network infrastructure",
  },
  {
    title: "Cloud Services (AWS & Server)",
    description:
      "Design and operate cloud infrastructure across AWS and Linux servers with secure networking, observability, backups, and cost-aware scaling.",
    icon: "☁",
    imageSrc:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&h=400&fit=crop&q=80",
    imageAlt: "Global cloud network over planet earth at night",
  },
  {
    title: "ETL data pipeline",
    description:
      "Build reliable extract-transform-load pipelines with validation, scheduling, monitoring, and reproducible data flows for analytics and AI workloads.",
    icon: "⇄",
    imageSrc:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=400&fit=crop&q=80",
    imageAlt: "Data dashboard with charts and pipeline-like flows",
  },
  {
    title: "Database design",
    description:
      "Model schemas for performance and integrity, define indexing strategies, and plan migrations so databases stay fast and maintainable as products evolve.",
    icon: "◫",
    imageSrc:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=640&h=400&fit=crop&q=80",
    imageAlt: "Developer reviewing database architecture diagrams",
  },
];

const credibilityStrip = [
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=280&fit=crop&q=80",
    alt: "Product team collaborating at a whiteboard",
    caption: "Delivery",
  },
  {
    src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=280&fit=crop&q=80",
    alt: "Security lock icon concept on laptop",
    caption: "Security-first",
  },
  {
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=280&fit=crop&q=80",
    alt: "Earth at night from space with city lights",
    caption: "Global scale",
  },
];

const gatewayCapabilities = [
  {
    title: "Identity & access (IAM)",
    body: "SSO, RBAC, and tenant boundaries so AI features respect your org’s policies.",
  },
  {
    title: "API integration",
    body: "Connect models and agents to your systems with stable contracts, retries, and audit trails.",
  },
  {
    title: "Cloud migration",
    body: "Move workloads and data paths safely—networking, secrets, and cost controls included.",
  },
  {
    title: "Governance & more",
    body: "Rate limits, logging, PII handling, and vendor strategy aligned with how you already operate.",
  },
];

export default function Home() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-black dark:text-zinc-100">
      <SiteHeader />

      <main>
        <section className="relative mx-auto max-w-6xl overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div
            className="animate-blob-a pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-500/15"
            aria-hidden
          />
          <div
            className="animate-blob-b pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-500/10"
            aria-hidden
          />
          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="animate-hero-in mb-4 inline-flex items-center rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200">
                Engineering · AI · Cloud
              </p>
              <h1 className="animate-hero-in-delay-1 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
                Build reliable software and AI that fits how your company already
                works.
              </h1>
              <p className="animate-hero-in-delay-2 mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                From CI/CD and modern web apps to agents, gateway design, and
                token-efficient LLM usage—We help teams ship faster with fewer
                surprises in production.
              </p>
              <p className="animate-hero-in-delay-2 mt-4 inline-flex max-w-2xl items-center rounded-full border border-teal-200/80 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200">
                Supporting startups from pre-seed to late stage · Deferred
                payment available
              </p>

              <div
                id="free-prototyping"
                className="animate-hero-in-delay-3 animate-proto-offer mt-10 scroll-mt-24 rounded-2xl border border-teal-300/60 bg-gradient-to-br from-teal-50/95 via-white to-teal-50/40 p-6 shadow-sm dark:border-teal-800/50 dark:from-teal-950/35 dark:via-zinc-950/80 dark:to-teal-950/20 sm:max-w-xl sm:p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  Limited offer
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Free prototyping session
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  One working session to clarify goals, sketch architecture, and
                  outline risks—so you can decide next steps with something
                  concrete on the table. No obligation.
                </p>
                <a
                  href="/get_touch"
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-teal-600 px-6 text-sm font-semibold text-white shadow-sm transition-[transform,background-color] duration-200 hover:scale-[1.02] hover:bg-teal-500 active:scale-[0.98]"
                >
                  Book your free prototype
                </a>
              </div>

              <div className="animate-hero-in-delay-4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#services"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-sm font-semibold text-zinc-900 transition-[transform,border-color,background-color] duration-200 hover:scale-[1.02] hover:border-zinc-400 hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                  Explore services
                </a>
              </div>
            </div>

            <div className="animate-hero-in-delay-2 relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100 shadow-2xl shadow-zinc-300/50 ring-1 ring-black/5 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=960&h=720&fit=crop&q=80"
                  alt="Engineering team collaborating on a product roadmap"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-900/40 via-transparent to-transparent dark:from-black/50" />
                <p className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white drop-shadow-md">
                  Hands-on delivery with your stakeholders and stack—not generic
                  slides.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200/80 bg-white py-12 dark:border-zinc-800/80 dark:bg-zinc-950/40">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
            {credibilityStrip.map((item) => (
              <figure
                key={item.caption}
                className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-[5/3]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <figcaption className="border-t border-zinc-100 px-4 py-3 text-center text-sm font-semibold text-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section
          id="services"
          className="border-y border-zinc-200/80 bg-white/60 py-20 dark:border-zinc-800/80 dark:bg-zinc-900/20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                What I can help you with
              </h2>
              <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
                Focused engagements: clear scope, concrete deliverables, and
                handoff your team can own.
              </p>
            </Reveal>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((item, index) => (
                <li key={item.title} className="min-h-0">
                  <Reveal delayMs={index * 70} className="block h-full">
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950/80">
                      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <span
                          className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-lg text-teal-700 transition-transform duration-300 group-hover:scale-110 dark:bg-teal-950/50 dark:text-teal-300"
                          aria-hidden
                        >
                          {item.icon}
                        </span>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="ai-gateway" className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-900 text-white shadow-xl dark:border-zinc-800">
                <div className="grid lg:grid-cols-2">
                  <div className="relative min-h-[280px] lg:min-h-[420px]">
                    <Image
                      src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=900&h=700&fit=crop&q=80"
                      alt="Abstract technology and data flows"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-900/20 to-zinc-900/90 lg:via-zinc-900/40" />
                  </div>
                  <div className="flex flex-col justify-center bg-gradient-to-br from-teal-700 via-teal-800 to-zinc-950 p-8 sm:p-12">
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      AI gateway for real company needs
                    </h2>
                    <p className="mt-4 max-w-xl text-teal-100">
                      A gateway is not just an API key—it is how you enforce IAM,
                      integrate internal and partner APIs, migrate safely to the
                      cloud, and keep AI spend and risk under control.
                    </p>
                    <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                      {gatewayCapabilities.map((cap) => (
                        <li
                          key={cap.title}
                          className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/15"
                        >
                          <h3 className="font-semibold">{cap.title}</h3>
                          <p className="mt-2 text-xs leading-relaxed text-teal-50/90 sm:text-sm">
                            {cap.body}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="contact"
          className="border-t border-zinc-200/80 bg-zinc-100/50 py-20 dark:border-zinc-800/80 dark:bg-zinc-900/30"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:grid-cols-2 sm:px-6">
            <Reveal>
              <div className="relative aspect-[4/3] max-w-md overflow-hidden rounded-2xl border border-zinc-200/80 shadow-lg dark:border-zinc-700 sm:max-w-none">
                <Image
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&h=525&fit=crop&q=80"
                  alt="Two colleagues having a focused discussion at a laptop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 40vw"
                />
              </div>
            </Reveal>
            <div className="text-center sm:text-left">
              <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Tell me about your stack and goals
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-zinc-600 sm:mx-0 dark:text-zinc-400">
                  Use the form to share your details and attach a supporting
                  document—I will follow up by email.
                </p>
              </Reveal>
              <Reveal delayMs={80}>
                <a
                  href="/get_touch"
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-semibold text-white transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white sm:mx-0"
                >
                  Open contact form
                </a>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200/80 py-8 dark:border-zinc-800/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} SimBay AI. All rights reserved.</p>
          <p className="text-center sm:text-right">
            CI/CD · Web · Agents · LLM efficiency · Docker · AI gateway
          </p>
        </div>
      </footer>
    </div>
  );
}
