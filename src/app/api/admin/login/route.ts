import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  getAdminCookieOptions,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import {
  clearLoginAttempts,
  getClientIp,
  getRetryAfterMinutes,
  isLoginRateLimited,
  recordFailedLogin,
} from "@/lib/login-rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isLoginRateLimited(ip)) {
    const minutes = getRetryAfterMinutes(ip);
    return NextResponse.json(
      {
        error: `Too many failed attempts. Try again in ${minutes} minute(s).`,
      },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!password || !(await verifyAdminPassword(password))) {
    recordFailedLogin(ip);
    return NextResponse.json(
      { error: "Invalid password. Only the store owner can access this area." },
      { status: 401 }
    );
  }

  clearLoginAttempts(ip);

  const response = NextResponse.json({ success: true });
  const cookieOptions = getAdminCookieOptions(60 * 60 * 24 * 7);
  response.cookies.set(ADMIN_COOKIE, await createSessionToken(), cookieOptions);

  return response;
}
