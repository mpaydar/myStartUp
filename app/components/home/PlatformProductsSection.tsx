import Link from "next/link";

import { careerLensMarketing } from "@/lib/careerLensMarketing";
import { siliconLensMarketing } from "@/lib/siliconLensMarketing";
import { siteMarketing } from "@/lib/siteMarketing";
import { Reveal } from "../Reveal";

const products = [
  {
    order: careerLensMarketing.productOrder,
    name: careerLensMarketing.productName,
    sub: careerLensMarketing.liveViewName,
    description: careerLensMarketing.shortDescription,
    spacy: careerLensMarketing.spacyNote,
    href: "/#careerlens",
    cta: "Explore CareerLens",
    accent: "violet",
    liveUrl: careerLensMarketing.liveAppUrl,
    liveLabel: "Open live app",
  },
  {
    order: siliconLensMarketing.productOrder,
    name: siliconLensMarketing.productName,
    sub: siliconLensMarketing.platformName,
    description: siliconLensMarketing.shortDescription,
    spacy: "SpaCy parses unstructured eBay listing text; YOLO inspects photos; Gemini + RAG writes the flip playbook.",
    href: "/#siliconlens",
    cta: "Explore SiliconLens",
    accent: "emerald",
    liveUrl: siliconLensMarketing.liveAppUrl,
    liveLabel: "View platform",
  },
] as const;

export function PlatformProductsSection() {
  return (
    <section
      id="platforms"
      className="scroll-mt-20 border-y border-zinc-200/80 bg-white py-16 dark:border-zinc-800/80 dark:bg-zinc-950/40 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-400">
            {siteMarketing.brand}
          </p>
          <h2 className="mt-3 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Two AI platforms. One SpaCy foundation.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {siteMarketing.companyDescription}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {products.map((p, index) => (
            <Reveal key={p.name} delayMs={index * 80}>
              <article
                className={`flex h-full flex-col rounded-2xl border p-6 shadow-sm ${
                  p.accent === "violet"
                    ? "border-violet-200/90 bg-violet-50/30 dark:border-violet-900/50 dark:bg-violet-950/20"
                    : "border-emerald-200/90 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    p.accent === "violet"
                      ? "text-violet-700 dark:text-violet-400"
                      : "text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  Platform {p.order} · {p.sub}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {p.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {p.description}
                </p>
                <p className="mt-4 rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-2 text-xs leading-relaxed text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    SpaCy:{" "}
                  </strong>
                  {p.spacy}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={p.href}
                    className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white ${
                      p.accent === "violet"
                        ? "bg-violet-700 hover:bg-violet-600"
                        : "bg-emerald-700 hover:bg-emerald-600"
                    }`}
                  >
                    {p.cta}
                  </Link>
                  <a
                    href={p.liveUrl}
                    {...(p.liveUrl.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  >
                    {p.liveLabel}
                    {p.liveUrl.startsWith("http") ? " ↗" : null}
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
