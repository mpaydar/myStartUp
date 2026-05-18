import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { adminAuthEnvDiagnostics, isAdminAuthConfigured } from "@/lib/adminEnv";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminSession";

import { AdminLoginForm } from "./AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const configured = isAdminAuthConfigured();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (configured && secret) {
    const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value ?? "";
    if (await verifyAdminSessionToken(secret, token)) {
      redirect("/admin");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Admin sign-in
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          SimBay internal portal
        </p>
        {!configured ? (
          <div
            className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
            role="status"
          >
            <p className="font-semibold">Finish setup in <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">.env</code></p>
            <ul className="mt-3 list-inside list-disc space-y-2 text-amber-900/95 dark:text-amber-100/90">
              <li>
                <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">ADMIN_PASSWORD</code> — your admin password
              </li>
              <li>
                <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">ADMIN_SESSION_SECRET</code> — random
                string, at least 24 characters (used to sign the session cookie)
              </li>
            </ul>
            <p className="mt-3 text-xs text-amber-900/85 dark:text-amber-200/80">
              Use exact names <code className="rounded bg-amber-100 px-0.5 dark:bg-amber-900">ADMIN_PASSWORD</code> and{" "}
              <code className="rounded bg-amber-100 px-0.5 dark:bg-amber-900">ADMIN_SESSION_SECRET</code> (or the
              lowercase variants). The session secret must be at least 24 characters. The file must live next to{" "}
              <code className="rounded bg-amber-100 px-0.5 dark:bg-amber-900">myapp/package.json</code>.
            </p>
            <p className="mt-3 text-xs text-amber-900/85 dark:text-amber-200/80">
              Restart <code className="rounded bg-amber-100 px-0.5 dark:bg-amber-900">npm run dev</code> after saving,
              then sign in below.
            </p>
            {process.env.NODE_ENV === "development" ? (
              <p className="mt-3 rounded-lg bg-amber-100/80 px-2 py-2 font-mono text-[11px] text-amber-950 dark:bg-amber-900/50 dark:text-amber-100">
                Dev check: password env {adminAuthEnvDiagnostics().passwordSet ? "set" : "missing"} · session secret
                length {adminAuthEnvDiagnostics().secretLength} (
                {adminAuthEnvDiagnostics().secretLongEnough ? "ok" : "need ≥24"})
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="mt-8">
          <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />}>
            <AdminLoginForm disabled={!configured} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
