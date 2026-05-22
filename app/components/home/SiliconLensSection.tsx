import Image from "next/image";
import Link from "next/link";

import {
  siliconLensHowItWorks,
  siliconLensMarketing,
  siliconLensScreens,
  siliconLensTechStack,
} from "@/lib/siliconLensMarketing";
import { Reveal } from "../Reveal";
import { StepExplorer } from "./StepExplorer";

const { platformName, productName, tagline, shortDescription } = siliconLensMarketing;

export function SiliconLensSection() {
  return (
    <>
      <section
        id="siliconlens"
        className="scroll-mt-20 border-y border-emerald-900/40 bg-zinc-950 py-16 text-zinc-100 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Example solution · {platformName}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {productName}
            </h2>
            <p className="mt-2 text-lg font-medium text-emerald-200/90">{tagline}</p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
              {shortDescription} Starting with GPUs on eBay—peer-to-peer listings have no barcodes,
              so SiliconLens reads unstructured text and images instead.
            </p>
          </Reveal>

          <div className="mt-12 space-y-10">
            {siliconLensScreens.map((screen, index) => (
              <Reveal key={screen.id} delayMs={index * 80}>
                <figure className="overflow-hidden rounded-2xl border border-emerald-900/50 bg-black shadow-2xl shadow-emerald-950/20 ring-1 ring-emerald-500/10">
                  <figcaption className="border-b border-zinc-800 px-4 py-3 sm:px-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                      {screen.eyebrow}
                    </p>
                    <p className="mt-1 text-sm text-zinc-300">{screen.caption}</p>
                  </figcaption>
                  <div className="relative aspect-[16/10] w-full bg-black">
                    <Image
                      src={screen.src}
                      alt={screen.alt}
                      fill
                      className="object-contain object-top p-1 sm:p-2"
                      sizes="(max-width: 1152px) 100vw, 1152px"
                      priority={index === 0}
                    />
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="siliconlens-tech"
        className="scroll-mt-20 border-b border-zinc-200/80 bg-emerald-50/40 py-16 dark:border-zinc-800/80 dark:bg-emerald-950/15 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h3 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
              Technology under the hood
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-zinc-600 dark:text-zinc-400">
              High-speed Go ingestion, SpaCy semantic parsing, YOLO visual inspection, and RAG +
              Gemini playbooks—no fragile automation bots.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {siliconLensTechStack.map((item, index) => (
              <Reveal key={item.name} delayMs={index * 50}>
                <article className="h-full rounded-2xl border border-emerald-200/90 bg-white p-5 shadow-sm dark:border-emerald-900/40 dark:bg-zinc-950/60">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                    {item.deploy}
                  </p>
                  <h4 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {item.detail}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200/80 bg-white py-16 dark:border-zinc-800/80 dark:bg-zinc-950/40 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h3 className="text-center text-xl font-semibold tracking-tight">
              How {productName} works
            </h3>
          </Reveal>
          <StepExplorer steps={[...siliconLensHowItWorks]} />
          <Reveal delayMs={120}>
            <p className="mt-10 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Don&apos;t waste hours on forums and spreadsheets—SiliconLens filters noise,
              calculates silicon arbitrage, and hands you the flip blueprint.{" "}
              <Link
                href="/get_in_touch"
                className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Request early access to {platformName}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
