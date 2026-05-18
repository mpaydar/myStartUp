"use client";

import Link from "next/link";
import { useState } from "react";

import type { PricingTier } from "@/lib/pricingTypes";

type PricingTierCardsProps = {
  tiers: PricingTier[];
  defaultSelectedId?: string;
  accent?: "teal" | "violet";
};

const accentClasses = {
  teal: {
    selected:
      "z-10 border-teal-500 ring-2 ring-teal-500/70 hover:border-teal-400 hover:shadow-teal-500/15 dark:border-teal-500 dark:ring-teal-500/50 dark:hover:shadow-teal-900/25",
    hover: "border-zinc-200 hover:border-teal-200/90 hover:shadow-teal-500/10 dark:border-zinc-800 dark:hover:border-teal-800/60",
    badge: "bg-teal-600 dark:bg-teal-500",
    priceHover: "group-hover:text-teal-700 dark:group-hover:text-teal-300",
    check: "text-teal-600 dark:text-teal-400",
    solidCta:
      "bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400",
    focusRing: "focus-visible:ring-teal-500",
  },
  violet: {
    selected:
      "z-10 border-violet-500 ring-2 ring-violet-500/70 hover:border-violet-400 hover:shadow-violet-500/15 dark:border-violet-500 dark:ring-violet-500/50 dark:hover:shadow-violet-900/25",
    hover: "border-zinc-200 hover:border-violet-200/90 hover:shadow-violet-500/10 dark:border-zinc-800 dark:hover:border-violet-800/60",
    badge: "bg-violet-600 dark:bg-violet-500",
    priceHover: "group-hover:text-violet-700 dark:group-hover:text-violet-300",
    check: "text-violet-600 dark:text-violet-400",
    solidCta:
      "bg-violet-600 hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400",
    focusRing: "focus-visible:ring-violet-500",
  },
} as const;

function PriceDisplay({ tier, accent }: { tier: PricingTier; accent: "teal" | "violet" }) {
  const a = accentClasses[accent];
  if (tier.pricePeriod === "none" && tier.price === 0) {
    return (
      <p className="mt-2">
        <span
          className={`text-3xl font-semibold tracking-tight text-zinc-900 transition-colors ${a.priceHover} dark:text-zinc-50`}
        >
          $0
        </span>
      </p>
    );
  }

  return (
    <p className="mt-2 flex items-baseline gap-1">
      <span
        className={`text-3xl font-semibold tracking-tight text-zinc-900 transition-colors ${a.priceHover} dark:text-zinc-50`}
      >
        ${tier.price}
      </span>
      {tier.pricePeriod === "month" ? (
        <span className="text-sm text-zinc-500 dark:text-zinc-400">/mo</span>
      ) : null}
    </p>
  );
}

export function PricingTierCards({
  tiers,
  defaultSelectedId,
  accent = "teal",
}: PricingTierCardsProps) {
  const initialId =
    defaultSelectedId && tiers.some((t) => t.id === defaultSelectedId)
      ? defaultSelectedId
      : (tiers.find((t) => t.highlight)?.id ?? tiers[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState(initialId);
  const a = accentClasses[accent];

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {tiers.map((tier) => {
        const selected = selectedId === tier.id;
        return (
          <div
            key={tier.id}
            tabIndex={0}
            aria-current={selected ? "true" : undefined}
            aria-label={`${tier.name} plan. Press Enter or Space to select.`}
            onClick={() => setSelectedId(tier.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedId(tier.id);
              }
            }}
            className={`group relative flex cursor-pointer flex-col rounded-2xl border bg-white p-6 pt-9 shadow-sm outline-none transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 dark:bg-zinc-900/80 dark:focus-visible:ring-offset-zinc-950 ${
              selected ? a.selected : a.hover
            } ${a.focusRing}`}
          >
            {tier.highlight ? (
              <p
                className={`pointer-events-none absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md ${a.badge}`}
              >
                Most popular
              </p>
            ) : null}
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {tier.name}
            </p>
            <PriceDisplay tier={tier} accent={accent} />
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {tier.tagline}
            </p>
            <ul className="mt-6 flex flex-1 flex-col gap-2.5">
              {tier.features.map((f) => (
                <li
                  key={f.text}
                  className={`flex gap-2 text-sm leading-snug ${
                    f.included
                      ? "text-zinc-800 dark:text-zinc-200"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  <span
                    className={`shrink-0 font-semibold ${
                      f.included ? a.check : "text-zinc-300 dark:text-zinc-600"
                    }`}
                    aria-hidden
                  >
                    {f.included ? "✓" : "✕"}
                  </span>
                  <span
                    className={
                      f.included
                        ? ""
                        : "line-through decoration-zinc-300 dark:decoration-zinc-600"
                    }
                  >
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={`/get_started?plan=${tier.id}`}
              className={
                tier.ctaStyle === "solid"
                  ? `relative z-[1] mt-8 inline-flex h-12 w-full items-center justify-center gap-1 rounded-full text-sm font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] ${a.solidCta}`
                  : "relative z-[1] mt-8 inline-flex h-12 w-full items-center justify-center gap-1 rounded-full border-2 border-zinc-900 bg-transparent text-sm font-semibold text-zinc-900 transition-[transform,background-color,box-shadow] duration-200 hover:scale-[1.02] hover:bg-zinc-50 hover:shadow-sm active:scale-[0.98] dark:border-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800/60"
              }
              onClick={(e) => e.stopPropagation()}
            >
              {tier.cta}
              <span aria-hidden>↗</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
