import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "../components/Reveal";
import { SiteHeader } from "../components/SiteHeader";
import { siteMarketing } from "@/lib/siteMarketing";
import { getTeamMemberInitials, teamMembers } from "@/lib/team";

export const metadata: Metadata = {
  title: `About us — ${siteMarketing.brand}`,
  description:
    "Meet the SimBay AI team—we design AI software solutions, with SpaCy-powered NLP at the core.",
};

export default function AboutPage() {
  const { brand, companyDescription, contactEmail } = siteMarketing;

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-black dark:text-zinc-100">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <Reveal>
          <p className="text-sm font-medium text-violet-700 dark:text-violet-400">
            <Link href="/" className="hover:underline">
              ← Back to home
            </Link>
          </p>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            About us
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {companyDescription}
          </p>
        </Reveal>

        <section className="mt-14" aria-labelledby="team-heading">
          <Reveal delayMs={60}>
            <h2
              id="team-heading"
              className="text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Team
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              The people designing and shipping AI software solutions at {brand}.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-12">
            {teamMembers.map((member, index) => (
              <li key={member.id}>
                <Reveal delayMs={100 + index * 80}>
                  <article className="flex flex-col gap-8 sm:flex-row sm:items-start">
                    <div className="relative mx-auto aspect-[3/4] w-44 shrink-0 overflow-hidden rounded-2xl border border-zinc-200/90 bg-zinc-100 shadow-lg ring-1 ring-black/5 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-white/10 sm:mx-0 sm:w-52">
                      {member.imageSrc ? (
                        <Image
                          src={member.imageSrc}
                          alt={member.imageAlt ?? member.name}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 640px) 176px, 208px"
                          priority={index === 0}
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-950 dark:to-violet-900"
                          aria-hidden
                        >
                          <span className="text-3xl font-semibold tracking-tight text-violet-700 dark:text-violet-300">
                            {getTeamMemberInitials(member.name)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-violet-700 dark:text-violet-400">
                        {member.role}
                      </p>
                      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {member.bio}
                      </p>
                      {member.links && member.links.length > 0 ? (
                        <ul className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                          {member.links.map((link) => (
                            <li key={link.href}>
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 items-center rounded-full border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition-colors hover:border-violet-400 hover:text-violet-700 dark:border-zinc-600 dark:text-zinc-200 dark:hover:border-violet-600 dark:hover:text-violet-300"
                              >
                                {link.label} ↗
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <Reveal delayMs={200}>
          <div className="mt-16 rounded-2xl border border-violet-200/80 bg-violet-50/50 px-6 py-8 text-center dark:border-violet-900/50 dark:bg-violet-950/25 sm:px-10">
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              Interested in our platforms or building together?
            </p>
            <Link
              href="/get_in_touch"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-violet-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-500"
            >
              Get in touch
            </Link>
            <p className="mt-4 text-sm text-zinc-500">
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium text-violet-700 hover:underline dark:text-violet-400"
              >
                {contactEmail}
              </a>
            </p>
          </div>
        </Reveal>
      </main>

      <footer className="border-t border-zinc-200/80 py-8 dark:border-zinc-800/80">
        <p className="text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} {brand}
        </p>
      </footer>
    </div>
  );
}
