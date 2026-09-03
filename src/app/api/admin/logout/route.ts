import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminCookieOptions } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", getAdminCookieOptions(0));
  return response;
}
