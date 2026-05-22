import Image from "next/image";
import Link from "next/link";

import { careerLensMarketing } from "@/lib/careerLensMarketing";

const { liveAppUrl, liveViewName, githubUrl } = careerLensMarketing;

export function SiteHeader() {
  return (
    <header className="animate-header-in sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="transition-transform duration-300 hover:scale-[1.02]"
        >
          <Image
            src="/simbay-ai-logo.png"
            alt="SimBay AI"
            width={160}
            height={160}
            className="h-10 w-auto rounded-md"
            priority
          />
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 text-xs text-zinc-600 sm:gap-x-4 sm:text-sm dark:text-zinc-400">
          <Link
            href="/#preview"
            className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
          >
            Product
          </Link>
          <Link
            href="/#gap-analysis"
            className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
          >
            Gap analysis
          </Link>
          <Link
            href="/#stack"
            className="hidden transition-colors hover:text-violet-600 sm:inline dark:hover:text-violet-400"
          >
            Stack
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden transition-colors hover:text-violet-600 sm:inline dark:hover:text-violet-400"
          >
            GitHub
          </a>
          <a
            href={liveAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-violet-700 px-4 py-1.5 font-medium text-white transition-transform duration-200 hover:scale-[1.03] hover:bg-violet-600 active:scale-[0.98] dark:bg-violet-600 dark:hover:bg-violet-500"
          >
            Try {liveViewName}
          </a>
          <Link
            href="/get_in_touch"
            className="rounded-full border border-zinc-300 px-4 py-1.5 font-medium text-zinc-800 transition-colors hover:border-zinc-400 dark:border-zinc-600 dark:text-zinc-200 dark:hover:border-zinc-500"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
