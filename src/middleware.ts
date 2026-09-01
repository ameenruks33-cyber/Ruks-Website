import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

async function requireAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API (except login POST)
  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/login" && request.method === "POST") {
      return NextResponse.next();
    }
    if (!(await requireAdminSession(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return withSecurityHeaders(NextResponse.next());
  }

  // Protect catalog writes
  if (pathname === "/api/catalog" && request.method === "PUT") {
    if (!(await requireAdminSession(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return withSecurityHeaders(NextResponse.next());
  }

  // Protect admin order list (not public order tracking)
  if (pathname === "/api/orders" && request.method === "GET") {
    const orderNumber = request.nextUrl.searchParams.get("orderNumber");
    if (!orderNumber && !(await requireAdminSession(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Admin pages
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (await verifySessionToken(token)) {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/admin", request.url))
      );
    }
    return withSecurityHeaders(NextResponse.next());
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return withSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/catalog",
    "/api/orders",
  ],
};
