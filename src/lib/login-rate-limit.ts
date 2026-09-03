const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function isLoginRateLimited(ip: string): boolean {
  const entry = attempts.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    attempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearLoginAttempts(ip: string): void {
  attempts.delete(ip);
}

export function getRetryAfterMinutes(ip: string): number {
  const entry = attempts.get(ip);
  if (!entry) return 0;
  return Math.ceil((entry.resetAt - Date.now()) / 60000);
}
