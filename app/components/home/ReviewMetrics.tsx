"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

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

type ReviewMetricsProps = {
  startCount: number;
  endCount: number;
  days: number;
};

export function ReviewMetrics({ startCount, endCount, days }: ReviewMetricsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(startCount);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const nowDisplay = reducedMotion ? endCount : count;

  useEffect(() => {
    if (reducedMotion) return;

    const el = ref.current;
    if (!el) return;

    const run = () => {
      const duration = 1600;
      const t0 = performance.now();
      const from = startCount;
      const to = endCount;

      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = 1 - (1 - t) ** 3;
        setCount(Math.round(from + (to - from) * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [endCount, reducedMotion, startCount]);

  return (
    <div
      ref={ref}
      className="mt-10 grid gap-6 rounded-2xl border border-teal-200/80 bg-teal-50/60 px-6 py-8 dark:border-teal-900/50 dark:bg-teal-950/30 sm:grid-cols-3 sm:px-8 sm:py-10"
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">
          Then
        </p>
        <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          {startCount}
        </p>
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          Google reviews
        </p>
      </div>
      <div className="flex flex-col items-center justify-center border-y border-teal-200/60 py-4 sm:border-x sm:border-y-0 sm:py-0 dark:border-teal-800/50">
        <span className="text-2xl text-teal-600 dark:text-teal-400" aria-hidden>
          →
        </span>
        <p className="mt-1 text-xs font-medium text-teal-800 dark:text-teal-300">
          in {days} days
        </p>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">
          Now
        </p>
        <p className="mt-2 text-3xl font-bold tabular-nums text-teal-700 dark:text-teal-300 sm:text-4xl">
          {nowDisplay}
        </p>
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          Google reviews
        </p>
      </div>
    </div>
  );
}
