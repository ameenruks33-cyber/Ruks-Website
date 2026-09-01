import type { Banner, Category, Coupon, Product } from "@/types";
import type { SiteSettings } from "@/lib/settings";

export interface StoreCatalogData {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  coupons: Coupon[];
  settings: SiteSettings;
  updatedAt: string;
}

export type StoreCatalogPatch = Partial<
  Omit<StoreCatalogData, "updatedAt">
>;
