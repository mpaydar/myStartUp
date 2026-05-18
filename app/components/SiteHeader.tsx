import Image from "next/image";
import Link from "next/link";

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
            href="/#reviews"
            className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
          >
            Reviews
          </Link>
          <Link
            href="/#crm"
            className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
          >
            CRM
          </Link>
          <Link
            href="/#insights"
            className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
          >
            Insights
          </Link>
          <Link
            href="/#social"
            className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
          >
            Social
          </Link>
          <Link
            href="/#web-apps"
            className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
          >
            Websites
          </Link>
          <Link
            href="/#ai-api"
            className="transition-colors hover:text-sky-600 dark:hover:text-sky-400"
          >
            AI &amp; API
          </Link>
          <Link
            href="/get_in_touch"
            className="rounded-full bg-zinc-900 px-4 py-1.5 font-medium text-white transition-transform duration-200 hover:scale-[1.03] hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Contact us
          </Link>
        </nav>
      </div>
    </header>
  );
}
