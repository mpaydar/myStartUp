import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { ADMIN_SESSION_SECRET_MIN_LEN, getAdminAuthCredentials } from "@/lib/adminEnv";
import { adminSessionSetOptions } from "@/lib/adminCookie";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "@/lib/adminSession";

export const runtime = "nodejs";

function safeEqualPassword(input: string, expected: string): boolean {
  const a = Buffer.from(input, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const creds = getAdminAuthCredentials();
  if (!creds) {
    return NextResponse.json(
      {
        error: `Admin login is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET (${ADMIN_SESSION_SECRET_MIN_LEN}+ characters) in .env in the myapp folder, then restart the dev server.`,
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const password =
    typeof body === "object" && body !== null && "password" in body
      ? String((body as Record<string, unknown>).password ?? "")
      : "";

  if (!password || !safeEqualPassword(password, creds.password)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = await createAdminSessionToken(creds.secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionSetOptions());
  return res;
}
