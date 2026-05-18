import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getRecaptchaSiteKey } from "@/lib/recaptcha";
import { getContactDirectCta } from "@/lib/siteMarketing";
import { ContactForm } from "../components/ContactForm";
import { ContactTextDirect } from "../components/ContactTextDirect";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Get in touch — SimBay AI",
  description:
    "Book a demo in NJ or NY: review software, form and CRM design, or a new or refreshed landing page for your business.",
};

type PageProps = {
  searchParams: Promise<{ interest?: string }>;
};

export default async function GetInTouchPage({ searchParams }: PageProps) {
  const { interest } = await searchParams;
  const recaptchaSiteKey = getRecaptchaSiteKey();
  const directCta = getContactDirectCta();
  const defaultInterestIds =
    interest?.trim() === "ai_api_integration" ? (["ai_api_integration"] as const) : undefined;

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-black dark:text-zinc-100">
      <SiteHeader />

      <main className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <div
          className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl dark:bg-teal-500/10"
          aria-hidden
        />
        <div className="relative">
          <p className="text-sm font-medium text-teal-700 dark:text-teal-400">
            <Link
              href="/"
              className="transition-colors hover:text-teal-600 dark:hover:text-teal-300"
            >
              ← Back to home
            </Link>
          </p>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Serving{" "}
            <strong className="font-medium text-zinc-800 dark:text-zinc-200">
              New Jersey and New York
            </strong>
            . Book time for a walkthrough of SimBay, or ask about{" "}
            <strong className="font-medium text-zinc-800 dark:text-zinc-200">
              form and CRM design
            </strong>{" "}
            and a{" "}
            <strong className="font-medium text-zinc-800 dark:text-zinc-200">
              landing page
            </strong>{" "}
            for your business—new build or a refresh so it feels more modern.
            Share details below and attach any brief or screenshots that help.
          </p>

          <div className="relative mt-8 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-zinc-200/80 shadow-md dark:border-zinc-700">
            <Image
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=400&fit=crop&q=80"
              alt="Professional video call and scheduling"
              fill
              className="object-cover"
              sizes="(max-width: 672px) 100vw, 672px"
            />
          </div>

          <div className="mt-10 rounded-3xl border border-zinc-200/90 bg-white/80 p-6 shadow-lg shadow-zinc-200/40 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-none sm:p-10">
            <ContactForm
              recaptchaSiteKey={recaptchaSiteKey}
              defaultInterestIds={defaultInterestIds}
            />
          </div>

          <ContactTextDirect
            href={directCta.href}
            label={directCta.label}
            mode={directCta.mode}
            displayPhone={directCta.displayPhone}
          />
        </div>
      </main>
    </div>
  );
}
