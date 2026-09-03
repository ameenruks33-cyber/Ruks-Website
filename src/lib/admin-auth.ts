import bcrypt from "bcryptjs";

export const ADMIN_COOKIE = "nexcartx_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

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
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  const len = Math.max(bufA.length, bufB.length);
  let result = bufA.length === bufB.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    result |= (bufA[i] ?? 0) ^ (bufB[i] ?? 0);
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
  const jti = crypto.randomUUID();
  const payload = `${expiresAt}.${jti}`;
  const signature = await hmacSha256(secret, payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !getAdminSecret()) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expiresAtStr, jti, signature] = parts;
  if (!expiresAtStr || !jti || !signature) return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  try {
    const expected = await hmacSha256(getAdminSecret(), `${expiresAtStr}.${jti}`);
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
