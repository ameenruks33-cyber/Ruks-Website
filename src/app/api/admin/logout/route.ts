import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminCookieOptions } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", getAdminCookieOptions(0));
  return response;
}

export async function GET() {
  const response = NextResponse.redirect(
    new URL("/admin/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
  );
  response.cookies.set(ADMIN_COOKIE, "", getAdminCookieOptions(0));
  return response;
}
