import type { Metadata } from "next";
import Link from "next/link";

import { getDefaultPricingTier, getPricingTierByPlanId } from "@/lib/pricingTiers";
import { GetStartedClient } from "../components/get-started/GetStartedClient";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Get started — SimBay AI",
  description:
    "Tell us about your business and confirm your SimBay plan. First month free, cancel anytime.",
};

type PageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function GetStartedPage({ searchParams }: PageProps) {
  const { plan } = await searchParams;
  const tier = getPricingTierByPlanId(plan) ?? getDefaultPricingTier();
  const isWebPlan = tier.service === "web";
  const isAiPlan = tier.service === "ai";
  const pricingBackHref = isWebPlan
    ? "/#web-apps"
    : isAiPlan
      ? "/#ai-api"
      : "/#pricing";

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <SiteHeader />

      <main className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div
          className="pointer-events-none absolute -right-24 top-20 h-56 w-56 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-600/10"
          aria-hidden
        />
        <div className="relative">
          <p className="text-sm font-medium text-violet-700 dark:text-violet-400">
            <Link
              href={pricingBackHref}
              className="transition-colors hover:text-violet-900 dark:hover:text-violet-300"
            >
              ← Back to{" "}
              {isWebPlan ? "web pricing" : isAiPlan ? "AI & API pricing" : "pricing"}
            </Link>
          </p>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            {isWebPlan
              ? "Get your website started"
              : isAiPlan
                ? "Start your automation project"
                : "Get started"}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {isWebPlan
              ? "Tell us about your business—we'll reach out about your site. No payment today."
              : isAiPlan
                ? "Tell us what you want to automate—we'll confirm scope and quote. No payment today."
                : "A few details and we'll reach out to finish setup—no payment today."}
          </p>

          <div className="mt-10 rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 sm:p-10">
            <GetStartedClient tier={tier} />
          </div>
        </div>
      </main>
    </div>
  );
}
