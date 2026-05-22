import type { Metadata } from "next";
import Link from "next/link";

import { CareerLensProductPreview } from "./components/home/CareerLensProductPreview";
import { CareerLensStackSection } from "./components/home/CareerLensStackSection";
import {
  careerLensFeatureSections,
  careerLensHowItWorks,
  careerLensMarketing,
} from "@/lib/careerLensMarketing";
import { featureSectionImages } from "@/lib/featureSectionImages";
import { siteMarketing } from "@/lib/siteMarketing";
import { FeaturePillarSection } from "./components/home/FeaturePillarSection";
import { HeroSection } from "./components/home/HeroSection";
import { StepExplorer } from "./components/home/StepExplorer";
import { Reveal } from "./components/Reveal";
import { SiteHeader } from "./components/SiteHeader";

const { brand, companyTagline, flagshipProduct, contactEmail } = siteMarketing;
const {
  liveAppUrl,
  liveViewName,
  githubUrl,
  freemiumNote,
  dashboardTagline,
} = careerLensMarketing;

export const metadata: Metadata = {
  title: `${flagshipProduct} — ${liveViewName} | ${brand}`,
  description: careerLensMarketing.dashboardTagline,
};

export default function Home() {
  const footerPhone = siteMarketing.phoneDisplay.trim();

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-black dark:text-zinc-100">
      <SiteHeader />

      <main>
        <HeroSection />

        <section
          id="product"
          className="scroll-mt-20 border-y border-zinc-200/80 bg-zinc-950 py-16 text-zinc-100 dark:border-zinc-800/80 sm:py-20"
        >
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Flagship product · open source
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                {flagshipProduct}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-300">
                {dashboardTagline}
              </p>
              <p className="mt-3 text-sm text-zinc-500">{freemiumNote}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={liveAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 items-center justify-center rounded-2xl bg-violet-600 px-8 text-sm font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 hover:bg-violet-500 hover:shadow-lg active:scale-[0.99]"
                >
                  Launch {liveViewName}
                  <span
                    className="ml-2 inline-block transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    ↗
                  </span>
                </a>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-600 px-8 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-900"
                >
                  View on GitHub
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <CareerLensProductPreview />

        {careerLensFeatureSections.map((section) => (
          <FeaturePillarSection
            key={section.id}
            id={section.id}
            image={featureSectionImages[section.imageKey]}
            h2={section.h2}
            subheading={section.subheading}
            bullets={[...section.bullets]}
            howItWorksLine={section.howItWorksLine}
            visualSymbol={section.visualSymbol}
            reverse={section.reverse}
            variant={section.variant}
            liveDemoHref={section.externalCta ? liveAppUrl : `/#${section.id}`}
          />
        ))}

        <CareerLensStackSection />

        <section
          id="how-it-works"
          className="scroll-mt-20 border-y border-zinc-200/80 bg-white py-16 dark:border-zinc-800/80 dark:bg-zinc-950/40 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
                How it works
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">
                From resume upload to gap analysis, tailoring, and interview prep—the
                flow in the{" "}
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-violet-700 hover:underline dark:text-violet-400"
                >
                  CareerLens monorepo
                </a>
                .
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-center">
                <a
                  href={liveAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-violet-700 underline-offset-4 transition-colors hover:text-violet-600 hover:underline dark:text-violet-400 dark:hover:text-violet-300"
                >
                  Open the live app ↗
                </a>
              </p>
            </Reveal>
            <StepExplorer steps={[...careerLensHowItWorks]} />
          </div>
        </section>

        <section
          id="platform"
          className="scroll-mt-20 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {brand}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {companyTagline}. {flagshipProduct} is our first shipped platform—built
                with production ML infrastructure (SpaCy, FastAPI, Terraform, AKS) and
                a founder who uses it on real job searches.
              </p>
              <Link
                href="/get_in_touch"
                className="group mt-10 inline-flex h-12 items-center justify-center rounded-full border-2 border-violet-600 bg-transparent px-8 text-sm font-semibold text-violet-700 transition-[transform,background-color,box-shadow] duration-200 hover:scale-[1.02] hover:bg-violet-50 hover:shadow-md active:scale-[0.98] dark:border-violet-500 dark:text-violet-300 dark:hover:bg-violet-950/40"
              >
                Partner or get early access
                <span
                  className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200/80 py-8 dark:border-zinc-800/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 text-center text-sm text-zinc-500 sm:px-6">
          <p>
            {footerPhone ? (
              <>
                <a
                  href={`tel:${footerPhone.replace(/\D/g, "")}`}
                  className="text-zinc-600 underline-offset-2 transition-colors hover:text-violet-600 hover:underline dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  {footerPhone}
                </a>
                {" · "}
              </>
            ) : null}
            <a
              href={`mailto:${contactEmail}`}
              className="text-zinc-600 underline-offset-2 transition-colors hover:text-violet-600 hover:underline dark:text-zinc-400 dark:hover:text-violet-400"
            >
              {contactEmail}
            </a>
            {" · "}
            <a
              href={liveAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 underline-offset-2 transition-colors hover:text-violet-600 hover:underline dark:text-zinc-400 dark:hover:text-violet-400"
            >
              {liveViewName}
            </a>
            {" · "}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 underline-offset-2 transition-colors hover:text-violet-600 hover:underline dark:text-zinc-400 dark:hover:text-violet-400"
            >
              GitHub
            </a>
          </p>
          <p>
            © {new Date().getFullYear()} {brand}
          </p>
        </div>
      </footer>
    </div>
  );
}
