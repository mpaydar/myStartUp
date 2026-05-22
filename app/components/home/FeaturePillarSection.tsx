import Image from "next/image";
import { Reveal } from "../Reveal";

export type FeaturePillarProps = {
  id: string;
  h2: string;
  subheading: string;
  bullets: readonly [string, string, string];
  howItWorksLine: string;
  /** Single character or short symbol for the icon tile */
  visualSymbol: string;
  /** When true, visual column appears on the left on large screens */
  reverse?: boolean;
  /** Section background variant */
  variant?: "white" | "muted";
  /** Unsplash (or other remote) hero image for the visual column */
  image: {
    src: string;
    alt: string;
  };
  /** Optional CTA link (e.g. live app URL). */
  liveDemoHref?: string;
};

export function FeaturePillarSection({
  id,
  h2,
  subheading,
  bullets,
  howItWorksLine,
  visualSymbol,
  reverse = false,
  variant = "white",
  image,
  liveDemoHref = "/#how-it-works",
}: FeaturePillarProps) {
  const isExternal = liveDemoHref.startsWith("http");
  const ctaLabel = isExternal ? "Open live app" : "See how it works";

  const bg =
    variant === "muted"
      ? "border-y border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-900/25"
      : "border-y border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950/40";

  return (
    <section
      id={id}
      aria-label={h2}
      className={`scroll-mt-20 py-16 sm:py-20 ${bg}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className={reverse ? "lg:order-2" : "lg:order-1"}>
            <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {h2}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {subheading}
            </p>
            <ul className="mt-6 list-disc space-y-4 pl-5 text-base leading-relaxed text-zinc-800 marker:text-violet-600 dark:text-zinc-200 dark:marker:text-violet-400">
              {bullets.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
              {howItWorksLine}
            </p>
            <p className="mt-6">
              <a
                href={liveDemoHref}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-sm font-semibold text-violet-700 underline-offset-4 transition-colors hover:text-violet-600 hover:underline dark:text-violet-400 dark:hover:text-violet-300"
              >
                {ctaLabel}
                {isExternal ? " ↗" : null}
              </a>
            </p>
          </Reveal>

          <Reveal
            delayMs={80}
            className={reverse ? "lg:order-1" : "lg:order-2"}
          >
            <div className="mx-auto flex max-w-md flex-col items-center gap-5 lg:mx-0 lg:max-w-none">
              <span
                className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-200/80 bg-violet-50 text-3xl shadow-sm dark:border-violet-900/60 dark:bg-violet-950/50"
                aria-hidden
              >
                {visualSymbol}
              </span>
              <div className="feature-mockup relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-200/90 bg-zinc-100 shadow-lg ring-1 ring-black/5 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-white/10">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority={id === "extension"}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
