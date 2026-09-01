export const ADMIN_COOKIE = "rukza_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getAdminPassword(): string {
  // Password only from environment — never hardcoded in source code
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
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

export async function createSessionToken(): Promise<string> {
  return hmacSha256(getAdminSecret(), getAdminPassword());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !getAdminPassword() || !getAdminSecret()) return false;
  try {
    const expected = await createSessionToken();
    return timingSafeEqual(token, expected);
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!expected || !getAdminSecret()) return false;
  return timingSafeEqual(password, expected);
}
