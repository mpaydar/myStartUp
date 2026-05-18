import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getAdminAuthCredentials } from "@/lib/adminEnv";
import { verifyAdminSessionToken } from "@/lib/adminSession";

function isPublicAdminPath(pathname: string): boolean {
  return (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }
  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const creds = getAdminAuthCredentials();
  if (!creds) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error:
            "Admin is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env in the myapp folder (secret must be 24+ characters), then restart dev.",
        },
        { status: 503 },
      );
    }
    if (!pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (
    !(await verifyAdminSessionToken(
      creds.secret,
      request.cookies.get("admin_session")?.value ?? "",
    ))
  ) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
