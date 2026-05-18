import { aiApiPricingTiers } from "@/lib/aiApiPricingTiers";
import { aiApiServicesContent } from "@/lib/aiApiServices";
import { Reveal } from "../Reveal";
import { PricingTierCards } from "./PricingTierCards";

const { services, pricingNote, trustLine, intro, title } = aiApiServicesContent;

export function AiApiIntegrationSection() {
  return (
    <section
      id={aiApiServicesContent.id}
      aria-labelledby="ai-api-heading"
      className="scroll-mt-20 border-y border-zinc-200/80 bg-white py-16 dark:border-zinc-800/80 dark:bg-zinc-950/40 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-400">
            {aiApiServicesContent.eyebrow}
          </p>
          <h2
            id="ai-api-heading"
            className="mt-3 text-center text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.number} delayMs={index * 60}>
              <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-sky-300/80 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-sky-800/60">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400">
                  Service {service.number}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {service.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={240}>
          <p className="mx-auto mt-14 max-w-2xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            No hidden fees. No retainer required. Custom builds quoted per scope.
          </p>

          <PricingTierCards
            tiers={aiApiPricingTiers}
            defaultSelectedId="ai-growth"
            accent="sky"
          />

          <p className="mt-10 text-center text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {pricingNote}
          </p>
          <p className="mt-4 text-center text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {trustLine}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
