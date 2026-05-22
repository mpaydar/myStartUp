import { siteMarketing } from "@/lib/siteMarketing";
import { Reveal } from "../Reveal";

export function SpacyEngineSection() {
  const { featuredSolutions } = siteMarketing;

  return (
    <section
      id="spacy"
      className="scroll-mt-20 border-y border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-emerald-50/40 py-16 dark:border-violet-900/50 dark:from-violet-950/40 dark:via-zinc-950 dark:to-emerald-950/20 sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-400">
            How we build
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            SpaCy at the core of every solution
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {siteMarketing.spacyHighlight} Each engagement adds the right surface—extensions,
            APIs, dashboards, vision, or LLM layers—around that semantic foundation.
          </p>
          <ul className="mx-auto mt-8 max-w-xl space-y-3 text-left text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            <li className="flex gap-2">
              <span className="font-semibold text-violet-700 dark:text-violet-400">
                {featuredSolutions.careerLens}:
              </span>
              <span>
                Resume–JD fit with aligned, missing, and context-mismatch skills; MLflow-tracked
                taxonomies.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {featuredSolutions.siliconLens}:
              </span>
              <span>
                Unstructured marketplace listings → VRAM clues, error behaviors, and condition
                entities for margin math.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                Your domain:
              </span>
              <span>
                We apply the same design discipline to new industries—custom taxonomies, workflows,
                and integrations.
              </span>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
