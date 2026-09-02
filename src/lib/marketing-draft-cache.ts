import type { MarketingPost } from "@/types/marketing";

const STORAGE_KEY = "rukza-marketing-draft";

export function cacheMarketingDraft(post: MarketingPost) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(post));
  } catch {
    // ignore quota errors
  }
}

export function readMarketingDraft(id: string): MarketingPost | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const post = JSON.parse(raw) as MarketingPost;
    return post.id === id ? post : null;
  } catch {
    return null;
  }
}

export function clearMarketingDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
