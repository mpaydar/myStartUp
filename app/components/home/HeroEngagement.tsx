"use client";

import { useSyncExternalStore } from "react";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

const miniBars = [35, 50, 42, 68, 55, 78, 62, 88, 72, 92];

type HeroEngagementProps = {
  regionLabel: string;
};

export function HeroEngagement({ regionLabel }: HeroEngagementProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  return (
    <div
      className="relative mx-auto mt-14 w-full max-w-md lg:mt-0 lg:max-w-none"
      aria-hidden
    >
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-violet-400/15 via-transparent to-teal-400/15 blur-2xl dark:from-violet-500/10 dark:to-teal-500/10" />
      <div className="relative rounded-3xl border border-zinc-200/90 bg-white/95 p-5 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-900/5 backdrop-blur-sm dark:border-zinc-700/90 dark:bg-zinc-900/95 dark:shadow-black/40 dark:ring-white/10 sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Live preview
            </p>
            <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Google reviews · {regionLabel}
            </p>
          </div>
          <div className="flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-1 dark:bg-amber-950/50">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={
                  reducedMotion
                    ? "text-amber-500 dark:text-amber-400"
                    : "hero-star-pop text-amber-500 dark:text-amber-400"
                }
                style={
                  reducedMotion
                    ? undefined
                    : { animationDelay: `${0.12 * (i - 1)}s` }
                }
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-5 w-full">
          <div
            className={`relative rounded-2xl border border-stone-200/90 bg-stone-50/90 p-4 dark:border-zinc-600 dark:bg-zinc-800/50 ${
              reducedMotion ? "" : "animate-sms-float"
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              SMS · automated
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              Thanks for visiting today! Tap below to share how it went — takes 60
              seconds and helps others find us.
            </p>
            <p
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm dark:border-emerald-900/50 dark:bg-zinc-900 dark:text-emerald-300 ${
                reducedMotion ? "" : "animate-pulse-soft"
              }`}
            >
              <span className="text-emerald-600 dark:text-emerald-400" aria-hidden>
                ✓
              </span>
              Review link sent
            </p>
          </div>

          <div
            className={`absolute -right-1 top-0 flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-lg shadow-md dark:border-zinc-600 dark:bg-zinc-800 ${
              reducedMotion ? "" : "animate-notify-bounce"
            }`}
          >
            🔔
          </div>

          <div className="pointer-events-none absolute bottom-0 left-3 z-10 w-[min(100%,13.5rem)] translate-y-[42%] rounded-2xl border border-zinc-200/95 bg-white p-3.5 shadow-lg dark:border-zinc-600 dark:bg-zinc-900 sm:left-4">
            <p className="text-[11px] leading-snug text-zinc-600 dark:text-zinc-400">
              Podium charges{" "}
              <span className="text-zinc-400 line-through decoration-zinc-400 dark:text-zinc-500">
                $399/mo
              </span>
            </p>
            <p className="mt-1 text-sm font-semibold leading-snug text-violet-600 dark:text-violet-400">
              You pay $49–$199/mo
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:mt-16">
          <div className="rounded-2xl bg-stone-100/90 p-3 dark:bg-zinc-800/70">
            <p className="text-[11px] font-medium leading-tight text-zinc-600 dark:text-zinc-400">
              <span className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                +34
              </span>{" "}
              New reviews · 30 days
            </p>
            <div className="mt-2 flex h-10 items-end gap-0.5">
              {miniBars.map((h, i) => (
                <div
                  key={i}
                  className="flex h-full min-w-0 flex-1 items-end justify-center"
                >
                  <span
                    className={`w-full max-w-[3px] rounded-t bg-gradient-to-t from-emerald-800 to-emerald-500 dark:from-emerald-600 dark:to-emerald-400 ${
                      reducedMotion ? "" : "hero-bar-rise"
                    }`}
                    style={{
                      height: `${h}%`,
                      animationDelay: reducedMotion ? undefined : `${0.04 * i}s`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-stone-100/90 p-3 dark:bg-zinc-800/70">
            <p className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              71%
            </p>
            <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
              Review rate
            </p>
            <p className="mt-2 text-[10px] leading-snug text-zinc-500 dark:text-zinc-500">
              Industry avg is 12%. Yours is 71%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
