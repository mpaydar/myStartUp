import type { Metadata } from "next";
import Link from "next/link";

import { serviceAreaLine, siteMarketing } from "@/lib/siteMarketing";
import { featureSectionImages } from "@/lib/featureSectionImages";
import { AiApiIntegrationSection } from "./components/home/AiApiIntegrationSection";
import { CrmLiveDemoModal } from "./components/home/CrmLiveDemoModal";
import { FeaturePillarSection } from "./components/home/FeaturePillarSection";
import { HeroSection } from "./components/home/HeroSection";
import { PricingTierCards } from "./components/home/PricingTierCards";
import { pricingTiers } from "@/lib/pricingTiers";
import { webAppPricingTiers } from "@/lib/webAppPricingTiers";
import { ReviewMetrics } from "./components/home/ReviewMetrics";
import { StepExplorer } from "./components/home/StepExplorer";
import { Reveal } from "./components/Reveal";
import { SiteHeader } from "./components/SiteHeader";

const { brand, serviceRegionShort, serviceRegionLong, verticalsTitle, verticalsBody } =
  siteMarketing;

export const metadata: Metadata = {
  title: `Review Management for ${verticalsTitle} in ${serviceRegionLong} | ${brand}`,
  description: `Automated Google review requests, monitoring, and response for local businesses in ${serviceRegionLong}. Plans from $49/mo. No contracts. Text support.`,
};

const howItWorks = [
  {
    step: "1",
    title: "Customer visits → review SMS",
    body: "An automatic text goes out asking for a Google review while the experience is still fresh—simple for them, zero extra work for you.",
  },
  {
    step: "2",
    title: "Instant notifications",
    body: "New reviews notify you immediately—good and bad—so Google review management never turns into a surprise you hear about too late.",
  },
  {
    step: "3",
    title: "Monthly report",
    body: "See your rating trend and how many new reviews came in that month—clear proof that automated review requests are moving the needle.",
  },
];

export default function Home() {
  const areaLine = serviceAreaLine();
  const footerPhone = siteMarketing.phoneDisplay.trim();

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-black dark:text-zinc-100">
      <SiteHeader />

      <main>
        <HeroSection />

        <FeaturePillarSection
          id="reviews"
          image={featureSectionImages.reviews}
          h2="Stop chasing customers for reviews. Let it happen automatically."
          subheading="For salons, HVAC, restaurants, and any local business that lives and dies by Google ratings."
          bullets={[
            "Customer visits → they get an SMS → AI helps them write a review in 3 taps → posted to Google. Zero effort from you.",
            "Review rate goes from the industry average of 12% to 60–70% because the hard part (writing) is done for them.",
            "Bad experiences are caught privately before they become public 1-star reviews.",
          ]}
          howItWorksLine="After each visit, an automated SMS is sent with a personalized link. The customer answers 3 quick questions. AI generates a natural review from their answers. They approve and post — all in under 60 seconds."
          visualSymbol="★"
          variant="white"
        />

        <div
          id="crm-live-demo"
          className="scroll-mt-20"
        >
          <FeaturePillarSection
            id="crm"
            image={featureSectionImages.crm}
            h2="Know your customers. Not just their names — their habits."
            subheading="A lightweight CRM built specifically for local service businesses — no bloat, no training required."
            bullets={[
              "Every customer profile shows visit history, reviews left, photos shared, and credits earned — in one place.",
              "Automatically flags customers who haven't returned in 60+ days so you can win them back before they're gone.",
              "Send targeted follow-ups by segment: new customers, regulars, lapsed, or high-spenders — with one click.",
            ]}
            howItWorksLine="Every review, visit, photo, and credit transaction feeds into the customer profile automatically. No manual data entry. The CRM builds itself."
            visualSymbol="◇"
            reverse
            variant="muted"
          />
        </div>

        <FeaturePillarSection
          id="insights"
          image={featureSectionImages.insights}
          h2="Your reviews are telling you how to run your business. We translate them."
          subheading="A monthly AI-generated report that reads every review and turns patterns into specific actions."
          bullets={[
            "See exactly what customers love (use it in your marketing) and what they complain about (fix it before it costs you).",
            "Ranked suggested actions each month — not vague tips, but specific moves tied to your actual review data.",
            "Track your Google rating trend, review volume, and how you compare to local competitors over time.",
          ]}
          howItWorksLine="Every review is analyzed by AI each month. Themes are extracted, ranked by frequency, and matched to business actions. Delivered as a clean dashboard and optional PDF report."
          visualSymbol="⌁"
          variant="white"
        />

        <FeaturePillarSection
          id="social"
          image={featureSectionImages.social}
          h2="Turn happy customers into your social media team."
          subheading="Customers share photos of their experience. You get a ready-to-post content queue for Instagram and Facebook — with their permission."
          bullets={[
            "Customers earn credits (redeemable as discounts) for uploading a photo after their visit — so they actually do it.",
            "Every photo arrives in your dashboard pre-captioned by AI, tagged for Instagram or Facebook, one tap to post.",
            "Explicit consent is captured and stored per customer — you're always legally covered.",
          ]}
          howItWorksLine="After a 4+ star review, customers are invited to add a photo for credits. They choose which platforms they allow. Photos land in your content queue ready to approve and publish — no social media manager needed."
          visualSymbol="✦"
          reverse
          variant="muted"
        />

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
                Google review management in {serviceRegionShort}, stripped down to what
                matters—automated review requests for your small business, no
                bloat.
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-center">
                <a
                  href="/#crm-live-demo"
                  className="text-sm font-semibold text-teal-700 underline-offset-4 transition-colors hover:text-teal-600 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Open the interactive CRM live demo
                </a>
              </p>
            </Reveal>
            <StepExplorer steps={howItWorks} />
          </div>
        </section>

        <section
          id="results"
          className="scroll-mt-20 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Results
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-600 dark:text-zinc-400">
                Typical lift when automated requests run consistently alongside great
                service.
              </p>
              <ReviewMetrics
                startCount={siteMarketing.resultsStartCount}
                endCount={siteMarketing.resultsEndCount}
                days={siteMarketing.resultsDays}
              />
              <figure className="mt-6 rounded-2xl border border-teal-200/80 bg-teal-50/60 px-6 py-8 dark:border-teal-900/50 dark:bg-teal-950/30 sm:px-10">
                <blockquote className="text-lg font-medium leading-snug text-zinc-900 dark:text-zinc-100 sm:text-xl">
                  &ldquo;{siteMarketing.resultsQuote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {siteMarketing.resultsAttribution}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        <section
          id="pricing"
          className="scroll-mt-20 border-y border-zinc-200/80 bg-white py-16 dark:border-zinc-800/80 dark:bg-zinc-950/30 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
                Review management pricing
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Pick the depth you need. Upgrade when you want CRM, insights, or social
                on autopilot—all with local support in {serviceRegionShort}.
              </p>

              <PricingTierCards tiers={pricingTiers} defaultSelectedId="growth" accent="teal" />

              <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-emerald-200/90 bg-emerald-50/90 px-4 py-4 text-sm leading-relaxed text-emerald-950 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/35 dark:text-emerald-100 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-200/80 text-lg dark:bg-emerald-900/60"
                  aria-hidden
                >
                  🐷
                </span>
                <p>
                  <strong className="font-semibold">Pro plan saves you $200+/month vs Podium</strong>{" "}
                  — $100+/month vs Birdeye — with local support included.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border-2 border-teal-500 bg-teal-50/40 p-4 text-center shadow-sm dark:border-teal-500 dark:bg-teal-950/30">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-200">
                    {brand} (Pro)
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    $199<span className="text-sm font-normal text-zinc-500">/mo</span>
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Reviews + CRM + insights + social
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Podium
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    $399+<span className="text-sm font-normal text-zinc-500">/mo</span>
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Reviews + messaging only
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Birdeye
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    $299+<span className="text-sm font-normal text-zinc-500">/mo</span>
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Reviews + basic reports
                  </p>
                </div>
              </div>

              <p className="mt-10 text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                All plans include: first month free · no setup fee · no annual contract ·
                data migration included · local developer you can text
              </p>
            </Reveal>
          </div>
        </section>

        <section
          id="web-apps"
          className="scroll-mt-20 border-y border-zinc-200/80 bg-zinc-50/80 py-16 dark:border-zinc-800/80 dark:bg-zinc-900/20 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
                Web application services
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                No hidden fees. No lock-in. Cancel anytime. Websites built for small businesses
                in {serviceRegionShort}—from a free one-page starter to full-service care.
              </p>

              <PricingTierCards
                tiers={webAppPricingTiers}
                defaultSelectedId="web-growth"
                accent="violet"
              />

              <p className="mt-10 text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                All plans include hosting-ready delivery · No contracts · Built for small
                businesses
              </p>
            </Reveal>
          </div>
        </section>

        <AiApiIntegrationSection />

        <section
          id="contact"
          className="scroll-mt-20 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                About
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                I&apos;m the developer behind {brand}, serving local businesses in{" "}
                {serviceRegionLong}. I build review tools for the region and answer
                my own support messages.
              </p>
              <Link
                href="/get_in_touch"
                className="group mt-10 inline-flex h-12 items-center justify-center rounded-full border-2 border-teal-600 bg-transparent px-8 text-sm font-semibold text-teal-700 transition-[transform,background-color,box-shadow] duration-200 hover:scale-[1.02] hover:bg-teal-50 hover:shadow-md active:scale-[0.98] dark:border-teal-500 dark:text-teal-300 dark:hover:bg-teal-950/40"
              >
                Book your free demo
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

        <CrmLiveDemoModal />
      </main>

      <footer className="border-t border-zinc-200/80 py-8 dark:border-zinc-800/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 text-center text-sm text-zinc-500 sm:px-6">
          <p>
            {areaLine}
            {footerPhone ? (
              <>
                {" "}
                ·{" "}
                <a
                  href={`tel:${footerPhone.replace(/\D/g, "")}`}
                  className="text-zinc-600 underline-offset-2 transition-colors hover:text-teal-600 hover:underline dark:text-zinc-400 dark:hover:text-teal-400"
                >
                  {footerPhone}
                </a>
              </>
            ) : (
              <> · Text support</>
            )}{" "}
            ·{" "}
            <a
              href={`mailto:${siteMarketing.contactEmail}`}
              className="text-zinc-600 underline-offset-2 transition-colors hover:text-teal-600 hover:underline dark:text-zinc-400 dark:hover:text-teal-400"
            >
              {siteMarketing.contactEmail}
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
