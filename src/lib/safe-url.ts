/** Client-safe URL helpers (no Node/server-only imports). */

export function safeAdminRedirectPath(raw: string | null | undefined): string {
  if (!raw) return "/admin";
  const value = raw.trim();
  if (!value.startsWith("/") || value.startsWith("//")) return "/admin";
  if (value.includes("://") || value.includes("\\")) return "/admin";
  if (!/^\/admin(\/|$)/.test(value)) return "/admin";
  return value;
}

export function isSafeInternalHref(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("/") && !href.startsWith("//") && !href.includes("://")) {
    return true;
  }
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isAllowedMapsEmbed(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "www.google.com" ||
        parsed.hostname === "maps.google.com") &&
      parsed.pathname.startsWith("/maps/embed")
    );
  } catch {
    return false;
  }
}
