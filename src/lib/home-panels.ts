export interface DealsBarPanel {
  enabled: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  countdownEndsAt: string;
}

export interface PromoBannerPanel {
  enabled: boolean;
  label: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface NewsletterPanel {
  enabled: boolean;
  title: string;
  description: string;
  emailPlaceholder: string;
  buttonText: string;
  successMessage: string;
}

export interface HomePanelsConfig {
  dealsBar: DealsBarPanel;
  promoBanner: PromoBannerPanel;
  newsletter: NewsletterPanel;
}

function endOfTodayIso(): string {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
}

export const DEFAULT_HOME_PANELS: HomePanelsConfig = {
  dealsBar: {
    enabled: true,
    title: "Today's Fashion Deals — Ends in",
    subtitle: "Up to 40% off selected styles · Free delivery over ₹999",
    buttonText: "Shop Deals",
    buttonLink: "/shop?filter=offers",
    countdownEndsAt: endOfTodayIso(),
  },
  promoBanner: {
    enabled: true,
    label: "New Season",
    title: "Ethnic & Western Looks",
    description: "Discover sarees, kurtis, western wear, menswear and kids styles for every occasion.",
    buttonText: "Explore Collection",
    buttonLink: "/shop?category=women-ethnic-wear",
  },
  newsletter: {
    enabled: true,
    title: "Stay in Style",
    description: "Get new arrivals, exclusive offers and style tips in your inbox.",
    emailPlaceholder: "Enter your email",
    buttonText: "Subscribe",
    successMessage: "You're subscribed! Watch for the latest drops.",
  },
};

export function normalizeHomePanels(
  panels?: Partial<HomePanelsConfig> | null
): HomePanelsConfig {
  return {
    dealsBar: { ...DEFAULT_HOME_PANELS.dealsBar, ...panels?.dealsBar },
    promoBanner: { ...DEFAULT_HOME_PANELS.promoBanner, ...panels?.promoBanner },
    newsletter: { ...DEFAULT_HOME_PANELS.newsletter, ...panels?.newsletter },
  };
}

export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string {
  if (!value) return endOfTodayIso();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return endOfTodayIso();
  return date.toISOString();
}
