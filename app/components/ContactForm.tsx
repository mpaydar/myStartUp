"use client";

import { executeRecaptchaV3, preloadRecaptchaV3 } from "@/lib/recaptchaClient";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

function subscribeMinDate(onStoreChange: () => void) {
  void onStoreChange;
  return () => {};
}

function getMinDateSnapshot() {
  return new Date().toISOString().slice(0, 10);
}

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/20";

type ContactFormProps = {
  recaptchaSiteKey: string | null;
};

export function ContactForm({ recaptchaSiteKey }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const minDate = useSyncExternalStore(
    subscribeMinDate,
    getMinDateSnapshot,
    getMinDateSnapshot,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = useCallback((file: File | undefined) => {
    if (file) setFileName(file.name);
    else setFileName(null);
  }, []);

  useEffect(() => {
    if (!recaptchaSiteKey) return;
    void preloadRecaptchaV3(recaptchaSiteKey).catch(() => {
      // Domain or network issues surface on submit with a user-facing message.
    });
  }, [recaptchaSiteKey]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setStatus("submitting");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = String(fd.get("firstName") ?? "").trim();
    const lastName = String(fd.get("lastName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();

    if (!firstName || !lastName) {
      setError("Please enter your first and last name.");
      setStatus("error");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    const meetingDate = String(fd.get("meetingDate") ?? "").trim();
    const meetingTime = String(fd.get("meetingTime") ?? "").trim();
    fd.delete("meetingDate");
    fd.delete("meetingTime");

    if (!meetingDate || !meetingTime) {
      setError("Please choose a date and time for your meeting.");
      setStatus("error");
      return;
    }

    const doc = fd.get("document");
    if (!(doc instanceof File) || doc.size === 0) {
      setError("Please attach a supporting document.");
      setStatus("error");
      return;
    }

    const dt = new Date(`${meetingDate}T${meetingTime}`);
    if (Number.isNaN(dt.getTime())) {
      setError("Invalid date or time.");
      setStatus("error");
      return;
    }

    if (dt.getTime() < Date.now() - 60_000) {
      setError("Please choose a meeting time in the future.");
      setStatus("error");
      return;
    }

    fd.append("meetingAt", dt.toISOString());

    if (!recaptchaSiteKey) {
      setError("The contact form is not available right now. Please try again later.");
      setStatus("error");
      return;
    }

    let recaptchaToken: string;
    try {
      recaptchaToken = await executeRecaptchaV3(recaptchaSiteKey);
    } catch {
      setError("Could not verify reCAPTCHA. Please try again.");
      setStatus("error");
      return;
    }

    fd.append("recaptchaToken", recaptchaToken);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setSuccessMessage(
        data.message ??
          "Your message has been successfully recorded. I will meet with you at the time you selected and follow up by email if anything changes.",
      );
      setStatus("success");
      form.reset();
      setFileName(null);
    } catch {
      setError("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            placeholder="Jane"
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            placeholder="Doe"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className={fieldClass}
        />
      </div>

      <div className="rounded-2xl border border-teal-200/80 bg-teal-50/40 p-6 dark:border-teal-900/50 dark:bg-teal-950/25">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Schedule a meeting
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Pick a date and time that works for you. Times use your device&apos;s
          local timezone.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="meetingDate"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Date
            </label>
            <input
              id="meetingDate"
              name="meetingDate"
              type="date"
              required
              min={minDate || undefined}
              className={`${fieldClass} min-h-[3rem] cursor-pointer [color-scheme:light] dark:[color-scheme:dark]`}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="meetingTime"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Time
            </label>
            <input
              id="meetingTime"
              name="meetingTime"
              type="time"
              required
              step={900}
              className={`${fieldClass} min-h-[3rem] cursor-pointer [color-scheme:light] dark:[color-scheme:dark]`}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <span
          id="document-label"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Supporting document
        </span>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Brief, RFP, architecture sketch, or requirements—PDF, Word, text, or
          image up to 15 MB. Files are stored in your Azure Blob container.
        </p>
        <input
          ref={inputRef}
          id="document"
          name="document"
          type="file"
          required
          className="sr-only"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/png,image/jpeg,image/webp"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const f = e.dataTransfer.files[0];
            if (f && inputRef.current) {
              const dt = new DataTransfer();
              dt.items.add(f);
              inputRef.current.files = dt.files;
              onFile(f);
            }
          }}
          className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-[border-color,background-color] ${
            isDragging
              ? "border-teal-500 bg-teal-50/80 dark:border-teal-400 dark:bg-teal-950/40"
              : "border-zinc-300 bg-zinc-50/50 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900/40 dark:hover:border-zinc-500"
          } `}
          aria-labelledby="document-label"
        >
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {fileName ? fileName : "Drop a file here or click to browse"}
          </span>
          <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
            PDF · DOC/DOCX · TXT · PNG · JPEG · WebP
          </span>
        </button>
      </div>

      {error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {!recaptchaSiteKey ? (
        <p
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          role="status"
        >
          reCAPTCHA is not configured. Add your site key to the environment
          before accepting submissions.
        </p>
      ) : null}

      {status === "success" && successMessage ? (
        <div
          className="rounded-xl border border-teal-200 bg-teal-50 px-5 py-4 text-teal-950 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-50"
          role="status"
        >
          <p className="font-semibold">Submission received</p>
          <p className="mt-2 text-sm leading-relaxed text-teal-900/95 dark:text-teal-100/90">
            {successMessage}
          </p>
        </div>
      ) : null}

      {recaptchaSiteKey ? (
        <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
          <p>
            Spam protection uses Google reCAPTCHA v3. There is no checkbox;
            verification runs automatically when you send this form. You may also
            see Google&apos;s reCAPTCHA badge in the corner of the page.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
            This site is protected by reCAPTCHA and the Google{" "}
            <a
              href="https://policies.google.com/privacy"
              className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://policies.google.com/terms"
              className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting" || !recaptchaSiteKey}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white shadow-sm transition-[transform,background-color] enabled:hover:scale-[1.01] enabled:hover:bg-teal-500 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
