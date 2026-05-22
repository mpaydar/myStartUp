import Link from "next/link";

import { careerLensMarketing } from "@/lib/careerLensMarketing";
import { siliconLensMarketing } from "@/lib/siliconLensMarketing";
import { siteMarketing } from "@/lib/siteMarketing";
import { Reveal } from "../Reveal";

const exampleSolutions = [
  {
    name: careerLensMarketing.productName,
    sub: careerLensMarketing.liveViewName,
    description: careerLensMarketing.shortDescription,
    spacy: careerLensMarketing.spacyNote,
    href: "/#careerlens",
    cta: "View solution",
    accent: "violet",
    liveUrl: careerLensMarketing.liveAppUrl,
    liveLabel: "Open live app",
  },
  {
    name: siliconLensMarketing.productName,
    sub: siliconLensMarketing.platformName,
    description: siliconLensMarketing.shortDescription,
    spacy:
      "SpaCy parses unstructured eBay listing text; YOLO inspects photos; Gemini + RAG writes the flip playbook.",
    href: "/#siliconlens",
    cta: "View solution",
    accent: "emerald",
    liveUrl: siliconLensMarketing.liveAppUrl,
    liveLabel: "Learn more",
  },
] as const;

export function PlatformProductsSection() {
  return (
    <section
      id="solutions"
      className="scroll-mt-20 border-y border-zinc-200/80 bg-white py-16 dark:border-zinc-800/80 dark:bg-zinc-950/40 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-400">
            What we build
          </p>
          <h2 className="mt-3 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            AI software solutions—built for your domain
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {siteMarketing.companyDescription}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-center text-xs text-zinc-500 dark:text-zinc-500">
            {siteMarketing.solutionsIntro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {exampleSolutions.map((solution, index) => (
            <Reveal key={solution.name} delayMs={index * 80}>
              <article
                className={`flex h-full flex-col rounded-2xl border p-6 shadow-sm ${
                  solution.accent === "violet"
                    ? "border-violet-200/90 bg-violet-50/30 dark:border-violet-900/50 dark:bg-violet-950/20"
                    : "border-emerald-200/90 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    solution.accent === "violet"
                      ? "text-violet-700 dark:text-violet-400"
                      : "text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  Example solution · {solution.sub}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {solution.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {solution.description}
                </p>
                <p className="mt-4 rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-2 text-xs leading-relaxed text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    SpaCy:{" "}
                  </strong>
                  {solution.spacy}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={solution.href}
                    className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white ${
                      solution.accent === "violet"
                        ? "bg-violet-700 hover:bg-violet-600"
                        : "bg-emerald-700 hover:bg-emerald-600"
                    }`}
                  >
                    {solution.cta}
                  </Link>
                  <a
                    href={solution.liveUrl}
                    {...(solution.liveUrl.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  >
                    {solution.liveLabel}
                    {solution.liveUrl.startsWith("http") ? " ↗" : null}
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={200}>
          <p className="mx-auto mt-12 max-w-xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Need a new AI product, internal tool, or NLP service? We scope, design, and ship custom
            software—not a fixed catalog of two apps.{" "}
            <Link
              href="/get_in_touch"
              className="font-semibold text-violet-700 hover:underline dark:text-violet-400"
            >
              Talk to us about your use case
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
