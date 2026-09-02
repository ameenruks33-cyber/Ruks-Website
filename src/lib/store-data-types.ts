import type { Banner, Category, Coupon, Product } from "@/types";
import type { SiteSettings } from "@/lib/settings";
import type { HomePanelsConfig } from "@/lib/home-panels";
import type { MarketingPost, SocialConnections } from "@/types/marketing";
import { DEFAULT_SOCIAL_CONNECTIONS } from "@/types/marketing";

export interface StoreCatalogData {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  coupons: Coupon[];
  settings: SiteSettings;
  homePanels: HomePanelsConfig;
  marketingPosts: MarketingPost[];
  socialConnections: SocialConnections;
  updatedAt: string;
}

export type StoreCatalogPatch = Partial<
  Omit<StoreCatalogData, "updatedAt">
>;
