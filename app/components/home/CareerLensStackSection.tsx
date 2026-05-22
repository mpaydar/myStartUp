import { careerLensMarketing, careerLensStack } from "@/lib/careerLensMarketing";
import { Reveal } from "../Reveal";

export function CareerLensStackSection() {
  const { githubUrl } = careerLensMarketing;

  return (
    <section
      id="stack"
      className="scroll-mt-20 border-y border-zinc-200/80 bg-zinc-50/80 py-16 dark:border-zinc-800/80 dark:bg-zinc-900/20 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            CareerLens · SpaCy-first architecture
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {careerLensMarketing.spacyNote} Gemini handles bullets after SpaCy classifies the gap.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {careerLensStack.map((item, index) => (
            <Reveal key={item.name} delayMs={index * 60}>
              <article className="h-full rounded-2xl border border-violet-200/80 bg-white p-5 shadow-sm dark:border-violet-900/40 dark:bg-zinc-950/60">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-400">
                  {item.deploy}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={200}>
          <p className="mt-10 text-center text-sm text-zinc-600 dark:text-zinc-400">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-violet-700 underline-offset-2 hover:underline dark:text-violet-400"
            >
              GitHub — CareerLensAI-_V2
            </a>
            {" · "}
            {careerLensMarketing.freemiumNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
