import bcrypt from "bcryptjs";

export const ADMIN_COOKIE = "nexcartx_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours — re-login daily for security

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function getAdminPasswordHash(): string {
  return process.env.ADMIN_PASSWORD_HASH?.trim() ?? "";
}

function getAdminSecret(): string {
  return (
    process.env.ADMIN_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    ""
  );
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function hmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function isAdminConfigured(): boolean {
  return Boolean(getAdminSecret() && (getAdminPasswordHash() || getAdminPassword()));
}

export async function createSessionToken(): Promise<string> {
  const secret = getAdminSecret();
  if (!secret) throw new Error("ADMIN_SECRET is not configured");

  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = String(expiresAt);
  const signature = await hmacSha256(secret, payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !getAdminSecret()) return false;

  const [expiresAtStr, signature] = token.split(".");
  if (!expiresAtStr || !signature) return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  try {
    const expected = await hmacSha256(getAdminSecret(), expiresAtStr);
    return timingSafeEqual(signature, expected);
  } catch {
    return false;
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = getAdminPasswordHash();
  const plain = getAdminPassword();
  const secret = getAdminSecret();

  if (!secret) return false;

  if (hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  }

  if (plain) {
    return timingSafeEqual(password, plain);
  }

  return false;
}

export function getAdminCookieOptions(maxAge: number) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict" as const,
    maxAge,
    path: "/",
  };
}
