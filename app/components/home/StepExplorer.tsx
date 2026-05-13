"use client";

import {
  useCallback,
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";

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

export type StepItem = {
  step: string;
  title: string;
  body: string;
};

type StepExplorerProps = {
  steps: StepItem[];
};

export function StepExplorer({ steps }: StepExplorerProps) {
  const [active, setActive] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const labelId = useId();
  const progress = ((active + 1) / steps.length) * 100;

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setAutoplayPaused(true);
        setActive((i) => Math.min(i + 1, steps.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setAutoplayPaused(true);
        setActive((i) => Math.max(i - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        setAutoplayPaused(true);
        setActive(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setAutoplayPaused(true);
        setActive(steps.length - 1);
      }
    },
    [steps.length],
  );

  useEffect(() => {
    if (reducedMotion || autoplayPaused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % steps.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [autoplayPaused, reducedMotion, steps.length]);

  const current = steps[active]!;

  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-labelledby={labelId}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-center sm:gap-3"
      >
        <p id={labelId} className="sr-only">
          Choose a step to see how it works
        </p>
        {steps.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.step}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`step-panel-${item.step}`}
              id={`step-tab-${item.step}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                setAutoplayPaused(true);
                setActive(index);
              }}
              className={`group relative flex flex-1 flex-col rounded-2xl border px-4 py-4 text-left transition-[transform,box-shadow,border-color,background-color] duration-300 sm:min-h-[5.5rem] sm:max-w-[14rem] sm:px-5 ${
                selected
                  ? "border-teal-500 bg-teal-50/90 shadow-md shadow-teal-500/10 ring-2 ring-teal-500/20 dark:border-teal-500 dark:bg-teal-950/40 dark:ring-teal-400/20"
                  : "border-zinc-200/90 bg-white/60 hover:-translate-y-0.5 hover:border-teal-300/80 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:border-teal-700"
              }`}
            >
              <span
                className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
                  selected
                    ? "bg-teal-600 text-white"
                    : "bg-zinc-200 text-zinc-700 group-hover:bg-teal-100 group-hover:text-teal-800 dark:bg-zinc-700 dark:text-zinc-200 dark:group-hover:bg-teal-900/60 dark:group-hover:text-teal-200"
                }`}
              >
                {item.step}
              </span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="mx-auto mt-6 h-1.5 max-w-md overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400 transition-[width] duration-500 ease-out dark:from-teal-400 dark:to-teal-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        id={`step-panel-${current.step}`}
        role="tabpanel"
        aria-labelledby={`step-tab-${current.step}`}
        className="mx-auto mt-8 max-w-2xl rounded-2xl border border-zinc-200/90 bg-gradient-to-br from-white to-zinc-50/80 p-6 text-center shadow-inner dark:border-zinc-800 dark:from-zinc-900/80 dark:to-zinc-950/80 sm:p-8"
      >
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 sm:text-xl">
          {current.title}
        </h3>
        <p
          key={active}
          className={`mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base ${
            reducedMotion ? "" : "animate-step-panel-in"
          }`}
        >
          {current.body}
        </p>
      </div>
    </div>
  );
}
