"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  GET_STARTED_BUSINESS_TYPES,
  type GetStartedBusinessType,
} from "@/lib/getStartedTypes";
import type { PricingTier } from "@/lib/pricingTiers";

const STEP_LABELS = ["Your business", "Confirm plan", "You're in"] as const;

type FormState = {
  firstName: string;
  businessName: string;
  phone: string;
  email: string;
  businessType: GetStartedBusinessType | "";
  googleBusinessUrl: string;
};

const emptyForm: FormState = {
  firstName: "",
  businessName: "",
  phone: "",
  email: "",
  businessType: "",
  googleBusinessUrl: "",
};

function StepCircle({
  stepIndex,
  currentStep,
}: {
  stepIndex: number;
  currentStep: number;
}) {
  const n = stepIndex + 1;
  const done = currentStep > stepIndex;
  const active = currentStep === stepIndex;
  if (done) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm text-white dark:bg-violet-500">
        ✓
      </span>
    );
  }
  if (active) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white dark:bg-violet-500">
        {n}
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-zinc-200 bg-white text-sm font-semibold text-zinc-400 dark:border-zinc-600 dark:bg-zinc-900">
      {n}
    </span>
  );
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto flex max-w-lg items-start gap-2">
      <div className="flex min-w-0 flex-1 items-start justify-between gap-1 sm:gap-2">
        <div className="flex w-[4.5rem] shrink-0 flex-col items-center gap-2 sm:w-28">
          <StepCircle
            stepIndex={0}
            currentStep={currentStep}
          />
          <span
            className={`text-center text-[10px] font-medium leading-tight sm:text-xs ${
              currentStep === 0
                ? "text-violet-800 dark:text-violet-300"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {STEP_LABELS[0]}
          </span>
        </div>
        <div
          className={`mx-0.5 mt-4 h-0.5 min-w-[1.5rem] flex-1 sm:min-w-[3rem] ${
            currentStep > 0 ? "bg-violet-500" : "bg-zinc-200 dark:bg-zinc-600"
          }`}
          aria-hidden
        />
        <div className="flex w-[4.5rem] shrink-0 flex-col items-center gap-2 sm:w-28">
          <StepCircle
            stepIndex={1}
            currentStep={currentStep}
          />
          <span
            className={`text-center text-[10px] font-medium leading-tight sm:text-xs ${
              currentStep === 1
                ? "text-violet-800 dark:text-violet-300"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {STEP_LABELS[1]}
          </span>
        </div>
        <div
          className={`mx-0.5 mt-4 h-0.5 min-w-[1.5rem] flex-1 sm:min-w-[3rem] ${
            currentStep > 1 ? "bg-violet-500" : "bg-zinc-200 dark:bg-zinc-600"
          }`}
          aria-hidden
        />
        <div className="flex w-[4.5rem] shrink-0 flex-col items-center gap-2 sm:w-28">
          <StepCircle
            stepIndex={2}
            currentStep={currentStep}
          />
          <span
            className={`text-center text-[10px] font-medium leading-tight sm:text-xs ${
              currentStep === 2
                ? "text-violet-800 dark:text-violet-300"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {STEP_LABELS[2]}
          </span>
        </div>
      </div>
      <span
        className="mt-2 shrink-0 text-lg leading-none text-zinc-300 dark:text-zinc-600"
        aria-hidden
      >
        ⋯
      </span>
    </div>
  );
}

function PlanBanner({ tier }: { tier: PricingTier }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-violet-200/90 bg-violet-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-violet-900/50 dark:bg-violet-950/40">
      <div>
        <p className="text-base font-semibold text-violet-950 dark:text-violet-100">
          {tier.name} plan selected
        </p>
        <p className="mt-0.5 text-sm text-violet-700/90 dark:text-violet-300/90">
          First month free · cancel anytime
        </p>
      </div>
      <p className="text-lg font-semibold tabular-nums text-violet-950 dark:text-violet-100 sm:text-right">
        ${tier.price}
        <span className="text-sm font-semibold text-violet-800 dark:text-violet-200">
          /mo
        </span>
      </p>
    </div>
  );
}

type GetStartedClientProps = {
  tier: PricingTier;
};

export function GetStartedClient({ tier }: GetStartedClientProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step1Valid = useMemo(() => {
    return (
      form.firstName.trim().length > 0 &&
      form.businessName.trim().length > 0 &&
      form.phone.trim().length > 0 &&
      form.email.includes("@") &&
      form.businessType !== ""
    );
  }, [form]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const goBackToForm = () => {
    setSubmitError(null);
    setCurrentStep(0);
  };

  const submitGetStarted = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/get-started", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          businessName: form.businessName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          businessType: form.businessType,
          googleBusinessUrl: form.googleBusinessUrl.trim() || undefined,
          planId: tier.id,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setSubmitError(
          typeof data.error === "string" ? data.error : "Something went wrong.",
        );
        return;
      }
      setCurrentStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <ProgressBar currentStep={currentStep} />

      <div className="mt-10 space-y-8">
        {currentStep < 2 ? <PlanBanner tier={tier} /> : null}

        {currentStep === 0 ? (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (step1Valid) setCurrentStep(1);
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="gs-firstName"
                  className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  Your first name
                </label>
                <input
                  id="gs-firstName"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="Maria"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500/30 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="gs-businessName"
                  className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  Business name
                </label>
                <input
                  id="gs-businessName"
                  name="businessName"
                  autoComplete="organization"
                  placeholder="Glow Salon"
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500/30 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="gs-phone"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Phone number (we&apos;ll text you to set up)
              </label>
              <input
                id="gs-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="(203) 555-0100"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500/30 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="gs-email"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Email
              </label>
              <input
                id="gs-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="maria@glowsalon.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500/30 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                required
              />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Type of business
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {GET_STARTED_BUSINESS_TYPES.map((type) => {
                  const selected = form.businessType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("businessType", type)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                        selected
                          ? "border-violet-600 bg-violet-600 text-white dark:border-violet-500 dark:bg-violet-500"
                          : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="gs-gbp"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Your Google Business profile link (optional — we can find it later)
              </label>
              <input
                id="gs-gbp"
                name="googleBusinessUrl"
                type="url"
                placeholder="maps.google.com/..."
                value={form.googleBusinessUrl}
                onChange={(e) => update("googleBusinessUrl", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500/30 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            </div>

            <button
              type="submit"
              disabled={!step1Valid}
              className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-zinc-300 bg-white text-sm font-semibold text-zinc-900 transition-[transform,opacity] hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Continue
              <span
                className="ml-1.5"
                aria-hidden
              >
                →
              </span>
            </button>
          </form>
        ) : null}

        {currentStep === 1 ? (
          <div className="space-y-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Double-check your details and plan. You can go back to edit anything.
            </p>
            <dl className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white text-sm dark:divide-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/60">
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-zinc-500 dark:text-zinc-400">Name</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                  {form.firstName}
                </dd>
              </div>
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-zinc-500 dark:text-zinc-400">Business</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                  {form.businessName}
                </dd>
              </div>
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-zinc-500 dark:text-zinc-400">Phone</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                  {form.phone}
                </dd>
              </div>
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-zinc-500 dark:text-zinc-400">Email</dt>
                <dd className="break-all font-medium text-zinc-900 dark:text-zinc-100">
                  {form.email}
                </dd>
              </div>
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-zinc-500 dark:text-zinc-400">Business type</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                  {form.businessType}
                </dd>
              </div>
              {form.googleBusinessUrl.trim() ? (
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-zinc-500 dark:text-zinc-400">Google profile</dt>
                  <dd className="max-w-[60%] break-all text-right font-medium text-zinc-900 dark:text-zinc-100">
                    {form.googleBusinessUrl}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-zinc-500 dark:text-zinc-400">Plan</dt>
                <dd className="font-medium text-violet-800 dark:text-violet-300">
                  {tier.name} · ${tier.price}/mo
                </dd>
              </div>
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goBackToForm}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void submitGetStarted()}
                className="rounded-xl border-2 border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800 sm:min-w-[12rem]"
              >
                {isSubmitting ? "Sending…" : "Confirm"}
                {!isSubmitting ? (
                  <span
                    className="ml-1"
                    aria-hidden
                  >
                    →
                  </span>
                ) : null}
              </button>
            </div>
            {submitError ? (
              <p
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {submitError}
              </p>
            ) : null}
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-3xl dark:bg-violet-950/80">
              ✓
            </div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              You&apos;re in
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Thanks, {form.firstName}. We emailed{" "}
              <strong className="text-zinc-800 dark:text-zinc-200">{form.email}</strong>{" "}
              with your confirmation for{" "}
              <strong className="text-zinc-800 dark:text-zinc-200">
                {form.businessName}
              </strong>{" "}
              on the{" "}
              <strong className="text-zinc-800 dark:text-zinc-200">{tier.name}</strong>{" "}
              plan. We&apos;ll follow up by email to finish setup (we have{" "}
              {form.phone} on file if we need to reach you).
            </p>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-zinc-300 bg-white px-8 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Back to home
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Want something else too?{" "}
              <Link
                href="/get_in_touch"
                className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-400"
              >
                Get in touch
              </Link>{" "}
              for demos, websites, or custom work.
            </p>
          </div>
        ) : null}
      </div>

      {currentStep === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2 text-center text-xs text-zinc-500 dark:text-zinc-400 sm:flex-row sm:justify-center sm:gap-8">
          <span>🔒 No card needed today</span>
          <span>🛡️ Your info is private</span>
        </div>
      ) : null}
    </div>
  );
}
