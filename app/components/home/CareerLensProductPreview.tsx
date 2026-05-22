import Image from "next/image";

import { careerLensMarketing, careerLensProductScreens } from "@/lib/careerLensMarketing";
import { Reveal } from "../Reveal";

const { liveAppUrl, liveViewName } = careerLensMarketing;

export function CareerLensProductPreview() {
  return (
    <section
      id="preview"
      className="scroll-mt-20 border-y border-zinc-200/80 bg-zinc-950 py-16 text-zinc-100 dark:border-zinc-800/80 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            {liveViewName} dashboard
          </p>
          <h2 className="mt-3 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            {careerLensMarketing.dashboardTagline}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-400">
            {careerLensMarketing.freemiumNote}
          </p>
        </Reveal>

        <div className="mt-12 space-y-10">
          {careerLensProductScreens.map((screen, index) => (
            <Reveal key={screen.id} delayMs={index * 80}>
              <figure className="overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl shadow-violet-950/30 ring-1 ring-white/10">
                <figcaption className="border-b border-zinc-800 px-4 py-3 sm:px-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-400">
                    {screen.eyebrow}
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">{screen.caption}</p>
                </figcaption>
                <div className="relative aspect-[16/10] w-full bg-black sm:aspect-[2/1]">
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    fill
                    className="object-contain object-top p-2 sm:p-3"
                    sizes="(max-width: 1152px) 100vw, 1152px"
                    priority={index === 0}
                  />
                </div>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={160}>
          <p className="mt-10 text-center">
            <a
              href={liveAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
            >
              Open your dashboard ↗
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
