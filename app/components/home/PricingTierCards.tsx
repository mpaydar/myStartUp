"use client";

import Link from "next/link";
import { useState } from "react";

import { pricingTiers } from "@/lib/pricingTiers";

const defaultSelectedId = "growth";

export function PricingTierCards() {
  const [selectedId, setSelectedId] = useState(defaultSelectedId);

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {pricingTiers.map((tier) => {
        const selected = selectedId === tier.id;
        return (
          <div
            key={tier.id}
            tabIndex={0}
            aria-current={selected ? "true" : undefined}
            aria-label={`${tier.name} plan, $${tier.price} per month. Press Enter or Space to select this plan.`}
            onClick={() => setSelectedId(tier.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedId(tier.id);
              }
            }}
            className={`group relative flex cursor-pointer flex-col rounded-2xl border bg-white p-6 pt-9 shadow-sm outline-none transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:bg-zinc-900/80 dark:focus-visible:ring-offset-zinc-950 ${
              selected
                ? "z-10 border-teal-500 ring-2 ring-teal-500/70 hover:border-teal-400 hover:shadow-teal-500/15 dark:border-teal-500 dark:ring-teal-500/50 dark:hover:shadow-teal-900/25"
                : "border-zinc-200 hover:border-teal-200/90 hover:shadow-teal-500/10 dark:border-zinc-800 dark:hover:border-teal-800/60"
            }`}
          >
            {tier.highlight ? (
              <p className="pointer-events-none absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white shadow-md dark:bg-teal-500">
                Most popular
              </p>
            ) : null}
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {tier.name}
            </h3>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-teal-700 dark:text-zinc-50 dark:group-hover:text-teal-300">
                ${tier.price}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">/month</span>
            </p>
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
                      : "text-zinc-400 line-through decoration-zinc-300 dark:text-zinc-500 dark:decoration-zinc-600"
                  }`}
                >
                  <span
                    className={`shrink-0 font-semibold ${
                      f.included
                        ? "text-teal-600 dark:text-teal-400"
                        : "text-zinc-300 dark:text-zinc-600"
                    }`}
                    aria-hidden
                  >
                    {f.included ? "✓" : "—"}
                  </span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/get_started?plan=${tier.id}`}
              className={
                tier.ctaStyle === "solid"
                  ? "relative z-[1] mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 hover:scale-[1.02] hover:bg-teal-500 hover:shadow-md active:scale-[0.98] dark:bg-teal-500 dark:hover:bg-teal-400"
                  : "relative z-[1] mt-8 inline-flex h-12 w-full items-center justify-center rounded-full border-2 border-zinc-900 bg-transparent text-sm font-semibold text-zinc-900 transition-[transform,background-color,box-shadow] duration-200 hover:scale-[1.02] hover:bg-zinc-50 hover:shadow-sm active:scale-[0.98] dark:border-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800/60"
              }
              onClick={(e) => e.stopPropagation()}
            >
              {tier.cta}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
