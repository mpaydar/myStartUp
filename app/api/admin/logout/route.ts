import { NextResponse } from "next/server";

import { adminSessionClearOptions } from "@/lib/adminCookie";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminSession";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", adminSessionClearOptions());
  return res;
}
