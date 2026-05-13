"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import { createPortal } from "react-dom";

const DEMO_HASH_PREFIX = "crm-live-demo";

export type CrmDemoTab = "profile" | "segments" | "alerts" | "followups";

function hashToTab(hash: string): { open: boolean; tab: CrmDemoTab } {
  const h = hash.replace(/^#/, "").toLowerCase();
  if (!h.startsWith(DEMO_HASH_PREFIX)) {
    return { open: false, tab: "profile" };
  }
  if (h === DEMO_HASH_PREFIX || h === `${DEMO_HASH_PREFIX}-profile`) {
    return { open: true, tab: "profile" };
  }
  if (h === `${DEMO_HASH_PREFIX}-segments`) return { open: true, tab: "segments" };
  if (h === `${DEMO_HASH_PREFIX}-alerts`) return { open: true, tab: "alerts" };
  if (h === `${DEMO_HASH_PREFIX}-followups`) return { open: true, tab: "followups" };
  return { open: true, tab: "profile" };
}

function tabToHash(tab: CrmDemoTab): string {
  if (tab === "profile") return `#${DEMO_HASH_PREFIX}`;
  return `#${DEMO_HASH_PREFIX}-${tab}`;
}

function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle
        cx="12"
        cy="7"
        r="4"
      />
    </svg>
  );
}

function IconUsers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle
        cx="9"
        cy="7"
        r="4"
      />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconBell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function IconSend(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

const TABS: {
  id: CrmDemoTab;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { id: "profile", label: "Customer profile", Icon: IconUser },
  { id: "segments", label: "Segments", Icon: IconUsers },
  { id: "alerts", label: "Smart alerts", Icon: IconBell },
  { id: "followups", label: "Follow-ups", Icon: IconSend },
];

function scrollDemoAnchorIntoView() {
  window.requestAnimationFrame(() => {
    document.getElementById("crm-live-demo")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

export function CrmLiveDemoModal() {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<CrmDemoTab>("profile");
  const [segmentCard, setSegmentCard] = useState<
    "new" | "regulars" | "lapsed" | "vip" | null
  >(null);

  const applyHash = useCallback((hash: string) => {
    const { open: shouldOpen, tab: nextTab } = hashToTab(hash);
    setOpen(shouldOpen);
    setTab(nextTab);
    setSegmentCard(null);
    if (shouldOpen) scrollDemoAnchorIntoView();
  }, []);

  useLayoutEffect(() => {
    applyHash(window.location.hash);
  }, [applyHash]);

  useEffect(() => {
    const onHash = () => applyHash(window.location.hash);
    const onPop = () => applyHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onPop);
    };
  }, [applyHash]);

  /** Next.js `<Link>` and soft navigations sometimes skip the fragment; force-sync from the clicked URL. */
  useEffect(() => {
    const onDocClickCapture = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("a");
      if (!el) return;
      const href = el.getAttribute("href");
      if (!href?.includes("crm-live-demo")) return;
      window.setTimeout(() => {
        let hash = window.location.hash;
        if (!hash.includes("crm-live-demo")) {
          try {
            const u = new URL(href, window.location.origin);
            if (u.hash && u.hash.includes("crm-live-demo")) {
              hash = u.hash;
              window.history.replaceState(
                null,
                "",
                `${window.location.pathname}${window.location.search}${u.hash}`,
              );
            }
          } catch {
            /* ignore */
          }
        }
        applyHash(hash || window.location.hash);
      }, 0);
    };
    document.addEventListener("click", onDocClickCapture, true);
    return () => document.removeEventListener("click", onDocClickCapture, true);
  }, [applyHash]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    const path = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", path);
  }, []);

  const selectTab = useCallback((next: CrmDemoTab) => {
    setTab(next);
    setSegmentCard(null);
    const h = tabToHash(next);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${h}`,
    );
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close demo"
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px] dark:bg-black/60"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(92vh,860px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-950"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-zinc-100 px-5 pb-4 pt-5 dark:border-zinc-800 sm:px-6">
          <div className="min-w-0 pr-2">
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl"
            >
              How the CRM works — live demo
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Click through each tab to see it in action.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="More options"
            >
              <span className="text-lg leading-none">⋯</span>
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label="Close"
            >
              <span
                className="block h-4 w-4 text-base leading-none"
                aria-hidden
              >
                ×
              </span>
            </button>
          </div>
        </header>

        <div
          role="tablist"
          aria-label="CRM demo views"
          className="flex shrink-0 flex-wrap gap-2 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800 sm:px-5"
        >
          {TABS.map(({ id, label, Icon }) => {
            const selected = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectTab(id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors ${
                  selected
                    ? "border-amber-200/90 bg-amber-50 text-zinc-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-zinc-100"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-500"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {tab === "profile" ? <ProfilePanel /> : null}
          {tab === "segments" ? (
            <SegmentsPanel
              selectedKey={segmentCard}
              onSelectCard={setSegmentCard}
            />
          ) : null}
          {tab === "alerts" ? <AlertsPanel /> : null}
          {tab === "followups" ? <FollowupsPanel /> : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ProfilePanel() {
  return (
    <>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Every customer builds their own profile automatically — no manual entry ever.
      </p>
      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-200">
            MR
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Maria Rodriguez
              </h3>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                Regular
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Glow Salon · Last visit 4 days ago · (203) 555-0142
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { n: "12", l: "Visits" },
            { n: "3", l: "Reviews left" },
            { n: "45", l: "Credits" },
            { n: "2", l: "Photos shared" },
          ].map((c) => (
            <div
              key={c.l}
              className="rounded-xl bg-zinc-50 px-3 py-2 text-center dark:bg-zinc-800/60"
            >
              <p className="text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {c.n}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{c.l}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Recent activity
          </p>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex gap-3">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                aria-hidden
              />
              <div>
                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                  Left a 5-star review — &ldquo;Staff were amazing, love my cut&rdquo;
                </p>
                <p className="text-xs text-zinc-500">4 days ago</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500"
                aria-hidden
              />
              <div>
                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                  Uploaded photo · shared to Instagram
                </p>
                <p className="text-xs text-zinc-500">4 days ago</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500"
                aria-hidden
              />
              <div>
                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                  Redeemed 20 credits — $10 off appointment
                </p>
                <p className="text-xs text-zinc-500">3 weeks ago</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                aria-hidden
              />
              <div>
                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                  Referred James T. — earned 20 bonus credits
                </p>
                <p className="text-xs text-zinc-500">Last month</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Every visit, review, photo, credit, and referral — in one place. Built
        automatically.
      </p>
    </>
  );
}

function SegmentsPanel({
  selectedKey,
  onSelectCard,
}: {
  selectedKey: "new" | "regulars" | "lapsed" | "vip" | null;
  onSelectCard: (k: "new" | "regulars" | "lapsed" | "vip") => void;
}) {
  const cards = [
    {
      key: "new" as const,
      title: "New customers",
      meta: "8 people · visited once",
      link: "Send welcome follow-up →",
      bg: "bg-violet-50/80 dark:bg-violet-950/30",
      border: "border-violet-100 dark:border-violet-900/40",
      icon: "👤+",
    },
    {
      key: "regulars" as const,
      title: "Regulars",
      meta: "34 people · 3+ visits",
      link: "Send loyalty reward →",
      bg: "bg-emerald-50/80 dark:bg-emerald-950/25",
      border: "border-emerald-100 dark:border-emerald-900/40",
      icon: "↻",
    },
    {
      key: "lapsed" as const,
      title: "Lapsed",
      meta: "11 people · 60+ days away",
      link: "Send win-back offer →",
      bg: "bg-rose-50/70 dark:bg-rose-950/25",
      border: "border-rose-100 dark:border-rose-900/40",
      icon: "⏱",
    },
    {
      key: "vip" as const,
      title: "High spenders",
      meta: "7 people · top 10%",
      link: "Send VIP offer →",
      bg: "bg-amber-50/80 dark:bg-amber-950/25",
      border: "border-amber-100 dark:border-amber-900/40",
      icon: "☆",
    },
  ];
  return (
    <>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Your customers are automatically sorted into 4 groups. Click a segment to
        message them.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.map((c) => {
          const sel = selectedKey === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onSelectCard(c.key)}
              className={`rounded-2xl border p-4 text-left transition-[box-shadow,ring] ${c.bg} ${c.border} ${
                sel ? "ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-zinc-950" : ""
              }`}
            >
              <span className="text-xl" aria-hidden>
                {c.icon}
              </span>
              <p className="mt-2 font-semibold text-zinc-900 dark:text-zinc-50">
                {c.title}
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{c.meta}</p>
              <p className="mt-3 text-sm font-medium text-violet-700 dark:text-violet-400">
                {c.link}
              </p>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Segments update in real time. No setup needed — it just happens.
      </p>
    </>
  );
}

function AlertsPanel() {
  return (
    <>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        The CRM watches your customers so you don&apos;t have to. These fire
        automatically.
      </p>
      <ul className="mt-4 space-y-3">
        <li className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 dark:border-rose-900/50 dark:bg-rose-950/30">
          <p className="text-sm font-semibold text-rose-900 dark:text-rose-200">
            ⏱ Sandra M. hasn&apos;t returned in 68 days
          </p>
          <p className="mt-2 text-sm leading-relaxed text-rose-800/95 dark:text-rose-200/90">
            She visited 4 times before. A win-back SMS with a small offer could bring
            her back. One tap to send.
          </p>
        </li>
        <li className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 dark:border-rose-900/50 dark:bg-rose-950/30">
          <p className="text-sm font-semibold text-rose-900 dark:text-rose-200">
            ★ New 3-star review — needs a response
          </p>
          <p className="mt-2 text-sm leading-relaxed text-rose-800/95 dark:text-rose-200/90">
            Posted 2 hours ago. Responding quickly improves your Google ranking. AI has
            a draft reply ready.
          </p>
        </li>
        <li className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
            🏆 You just passed Glamour Cuts on Google Maps
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800/95 dark:text-emerald-200/90">
            Your 4.8 rating with 47 reviews now ranks above your nearest competitor in
            Norwood searches.
          </p>
        </li>
        <li className="rounded-2xl border border-violet-200 bg-violet-50/90 p-4 dark:border-violet-900/50 dark:bg-violet-950/30">
          <p className="text-sm font-semibold text-violet-900 dark:text-violet-200">
            $ James T. has 45 credits — hasn&apos;t redeemed yet
          </p>
          <p className="mt-2 text-sm leading-relaxed text-violet-800/95 dark:text-violet-200/90">
            A reminder nudge often converts credits into a booked appointment within 48
            hours.
          </p>
        </li>
      </ul>
    </>
  );
}

function FollowupsPanel() {
  return (
    <>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Pick a segment, pick a message type. One tap sends to everyone in that group.
      </p>
      <div className="mt-4 space-y-4">
        <article className="rounded-2xl border border-stone-200 bg-stone-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Win-back · 11 lapsed customers
          </p>
          <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm leading-relaxed text-zinc-800 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200">
            Hey Sandra! It&apos;s been a while since we&apos;ve seen you at Glow Salon.
            We miss you — here&apos;s $10 off your next visit. Valid this month only.
            Book: glowsalon.com/book
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>AI-written · edit anytime before sending</span>
            <button
              type="button"
              className="text-sm font-semibold text-violet-700 hover:underline dark:text-violet-400"
            >
              Send to 11 →
            </button>
          </div>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-stone-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Loyalty reward · 34 regulars
          </p>
          <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm leading-relaxed text-zinc-800 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200">
            Thank you for being a regular, Maria! You&apos;ve visited us 12 times —
            you&apos;re officially a VIP. Enjoy a free deep condition on your next
            appointment. 🤍
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>AI-written · edit anytime before sending</span>
            <button
              type="button"
              className="text-sm font-semibold text-violet-700 hover:underline dark:text-violet-400"
            >
              Send to 34 →
            </button>
          </div>
        </article>
      </div>
    </>
  );
}
