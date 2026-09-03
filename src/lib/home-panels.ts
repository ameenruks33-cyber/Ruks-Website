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
    title: "NL-GAS Deals — Ends in",
    subtitle: "Up to 15% off commercial stoves + free delivery over ₹2,499",
    buttonText: "Shop NL-GAS",
    buttonLink: "/shop?filter=offers",
    countdownEndsAt: endOfTodayIso(),
  },
  promoBanner: {
    enabled: true,
    label: "Restaurant Range",
    title: "Commercial 4 & 6 Burner Sale",
    description: "NL-GAS-RS401 and NL-GAS-RS601 at special prices. Use code NLGAS15 at checkout.",
    buttonText: "View Commercial",
    buttonLink: "/shop?category=commercial-stoves",
  },
  newsletter: {
    enabled: true,
    title: "Get NL-GAS Offers",
    description: "New stove models, spare parts alerts and repair service updates.",
    emailPlaceholder: "Enter your mobile or email",
    buttonText: "Subscribe",
    successMessage: "You're subscribed! We'll send you the best gas stove deals.",
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
