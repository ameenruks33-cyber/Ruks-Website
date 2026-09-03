import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { requireHttpsRedirect } from "@/lib/security";

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

async function requireAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function middleware(request: NextRequest) {
  const httpsRedirect = requireHttpsRedirect(request);
  if (httpsRedirect) return httpsRedirect;

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/login" && request.method === "POST") {
      return withSecurityHeaders(NextResponse.next());
    }
    if (!(await requireAdminSession(request))) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    return withSecurityHeaders(NextResponse.next());
  }

  if (
    (pathname === "/api/catalog" || pathname === "/api/catalog/") &&
    request.method === "PUT"
  ) {
    if (!(await requireAdminSession(request))) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    return withSecurityHeaders(NextResponse.next());
  }

  if (pathname === "/api/upload" || pathname === "/api/marketing/publish") {
    if (pathname === "/api/marketing/publish" && request.method === "GET") {
      return withSecurityHeaders(NextResponse.next());
    }
    if (!(await requireAdminSession(request))) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    return withSecurityHeaders(NextResponse.next());
  }

  if (
    (pathname === "/api/orders" || pathname === "/api/orders/") &&
    request.method === "GET"
  ) {
    const orderNumber = request.nextUrl.searchParams.get("orderNumber");
    if (!orderNumber && !(await requireAdminSession(request))) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    return withSecurityHeaders(NextResponse.next());
  }

  if (pathname.startsWith("/api/orders/") && request.method === "PATCH") {
    if (!(await requireAdminSession(request))) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    return withSecurityHeaders(NextResponse.next());
  }

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
    loginUrl.searchParams.set("from", pathname.startsWith("/admin") ? pathname : "/admin");
    return withSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads/).*)"],
};
