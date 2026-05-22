import Link from "next/link";

import { careerLensMarketing } from "@/lib/careerLensMarketing";
import { heroServices, type HeroServiceAccent } from "@/lib/heroServices";
import { siliconLensMarketing } from "@/lib/siliconLensMarketing";
import { siteMarketing } from "@/lib/siteMarketing";

const { companyTagline, spacyHighlight } = siteMarketing;
const { liveAppUrl, liveViewName } = careerLensMarketing;

const accentStyles: Record<
  HeroServiceAccent,
  { card: string; icon: string; hover: string }
> = {
  violet: {
    card: "border-violet-200/80 bg-violet-50/50 dark:border-violet-900/50 dark:bg-violet-950/25",
    icon: "bg-violet-600 text-white dark:bg-violet-500",
    hover: "hover:border-violet-300 dark:hover:border-violet-700",
  },
  sky: {
    card: "border-sky-200/80 bg-sky-50/50 dark:border-sky-900/50 dark:bg-sky-950/25",
    icon: "bg-sky-600 text-white dark:bg-sky-500",
    hover: "hover:border-sky-300 dark:hover:border-sky-700",
  },
  emerald: {
    card: "border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/25",
    icon: "bg-emerald-600 text-white dark:bg-emerald-500",
    hover: "hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  teal: {
    card: "border-teal-200/80 bg-teal-50/50 dark:border-teal-900/50 dark:bg-teal-950/25",
    icon: "bg-teal-600 text-white dark:bg-teal-500",
    hover: "hover:border-teal-300 dark:hover:border-teal-700",
  },
};

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-6xl overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
      <div
        className="animate-blob-a pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/15"
        aria-hidden
      />
      <div
        className="animate-blob-b pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10"
        aria-hidden
      />

      <div className="relative z-10">
        <p className="animate-hero-in mb-5 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-sm dark:border-violet-800 dark:bg-zinc-900/80 dark:text-zinc-100">
            <span
              className="relative flex h-2 w-2 shrink-0 motion-reduce:animate-none"
              aria-hidden
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500/70 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-500" />
            </span>
            <span className="text-balance">{companyTagline}</span>
          </span>
        </p>

        <div className="animate-hero-in-delay-1 mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
            <span className="text-zinc-900 dark:text-zinc-50">{siteMarketing.brand}</span>
          </h1>
          <p className="animate-hero-in-delay-2 mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {siteMarketing.companyDescription}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-violet-700 dark:text-violet-400">
            {spacyHighlight}
          </p>
        </div>

        <ul className="animate-hero-in-delay-3 mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {heroServices.map((service, index) => {
            const a = accentStyles[service.accent];
            return (
              <li
                key={service.id}
                className="animate-hero-in"
                style={{ animationDelay: `${0.28 + index * 0.05}s` }}
              >
                <Link
                  href={service.href}
                  className={`group flex h-full gap-3 rounded-2xl border p-4 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-md ${a.card} ${a.hover}`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${a.icon}`}
                    aria-hidden
                  >
                    {service.symbol}
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {service.title}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-zinc-600 dark:text-zinc-400">
                      {service.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="animate-hero-in-delay-4 mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/#solutions"
            className="group inline-flex h-12 min-h-[3rem] flex-1 items-center justify-center rounded-2xl border-2 border-violet-700 bg-violet-700 px-6 text-sm font-semibold text-white transition-[transform,background-color] duration-200 hover:bg-violet-600 sm:max-w-xs sm:flex-initial"
          >
            Our solutions
          </Link>
          <Link
            href="/get_in_touch"
            className="inline-flex h-12 min-h-[3rem] flex-1 items-center justify-center rounded-2xl border-2 border-zinc-900 bg-white px-6 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 sm:max-w-xs sm:flex-initial"
          >
            Start a project
          </Link>
        </div>

        <p className="animate-hero-in-delay-4 mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Examples:{" "}
          <a
            href={liveAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-400"
          >
            {careerLensMarketing.productName}
          </a>
          {" · "}
          <Link
            href="/#siliconlens"
            className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
          >
            {siliconLensMarketing.productName}
          </Link>
        </p>
      </div>
    </section>
  );
}
