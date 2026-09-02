export interface DealsBarPanel {
  enabled: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  /** ISO datetime — countdown runs until this time */
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
    title: "Today's Deals — Ends in",
    subtitle: "Up to 40% off + free shipping over AED 300",
    buttonText: "Shop Deals",
    buttonLink: "/shop?filter=offers",
    countdownEndsAt: endOfTodayIso(),
  },
  promoBanner: {
    enabled: true,
    label: "Limited Time",
    title: "Summer Sale — Up to 40% Off",
    description:
      "Refresh your wardrobe with our exclusive summer collection. Use code SUMMER25 at checkout.",
    buttonText: "Shop Offers",
    buttonLink: "/shop?filter=offers",
  },
  newsletter: {
    enabled: true,
    title: "Get Exclusive Deals",
    description:
      "Subscribe for new arrivals, sales alerts & fashion tips — like Flipkart & Meesho deals!",
    emailPlaceholder: "Enter your email",
    buttonText: "Subscribe",
    successMessage: "You're subscribed! Check your inbox soon.",
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

/** Convert ISO string to value for `<input type="datetime-local" />` */
export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Convert datetime-local input value to ISO string */
export function fromDatetimeLocalValue(value: string): string {
  if (!value) return endOfTodayIso();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return endOfTodayIso();
  return date.toISOString();
}
