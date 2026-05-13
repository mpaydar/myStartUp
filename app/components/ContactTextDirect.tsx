type ContactTextDirectProps = {
  href: string;
  label: string;
  /** When no SMS number is configured, we use a prefilled mailto instead. */
  mode: "sms" | "email";
};

/**
 * Shown below the contact form: skip-the-form divider + direct reach CTA.
 */
export function ContactTextDirect({ href, label, mode }: ContactTextDirectProps) {
  const subcopy =
    mode === "sms"
      ? "Most owners prefer this — faster and more personal."
      : "Same idea as a text thread — one tap opens your mail app with a short template. I reply same day.";

  return (
    <div className="mt-12">
      <p className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
        — or skip the form —
      </p>
      <div className="mt-6 rounded-2xl border border-zinc-200/90 bg-white px-6 py-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950/60 sm:px-8">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Just text me directly
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          {subcopy}
        </p>
        <a
          href={href}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-[transform,background-color,border-color] hover:border-teal-400 hover:bg-teal-50/80 active:scale-[0.99] dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-teal-600 dark:hover:bg-teal-950/40"
          aria-label={
            mode === "sms"
              ? "Send a text message"
              : "Open your email app to send a quick message"
          }
        >
          <svg
            className="h-5 w-5 shrink-0 text-zinc-600 dark:text-zinc-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" />
          </svg>
          {label}
        </a>
      </div>
    </div>
  );
}
