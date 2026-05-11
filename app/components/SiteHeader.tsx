import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="animate-header-in sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-900 transition-transform duration-300 hover:scale-[1.02] dark:text-zinc-50"
        >
          SimBay AI
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Link
            href="/#services"
            className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
          >
            Services
          </Link>
          <Link
            href="/#free-prototyping"
            className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
          >
            Free prototype
          </Link>
          <Link
            href="/#ai-gateway"
            className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
          >
            AI gateway
          </Link>
          <Link
            href="/get_touch"
            className="rounded-full bg-zinc-900 px-4 py-1.5 font-medium text-white transition-transform duration-200 hover:scale-[1.03] hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Get in touch
          </Link>
        </nav>
      </div>
    </header>
  );
}
