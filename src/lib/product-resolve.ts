import type { Banner, Coupon, Product } from "@/types";
import {
  products as seedProducts,
  banners as seedBanners,
  coupons as seedCoupons,
} from "@/data/store";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";
import { DEFAULT_HOME_PANELS, type HomePanelsConfig } from "@/lib/home-panels";

const GAS_CATEGORY_SLUGS = new Set([
  "gas-kitchen",
  "single-burner",
  "double-burner",
  "home-stoves",
  "commercial-stoves",
  "gas-accessories",
  "spare-parts",
  "gas-stoves",
]);

const GAS_TEXT = /nl[-\s]?gas|gas\s*stove|burner|commercial\s*stove|repair\s*service/i;
const LEGACY_STORE_NAME = /rukza|fashion\s*hub|nl[-\s]?gas/i;

function isGasProduct(product: Product): boolean {
  if (GAS_CATEGORY_SLUGS.has(product.categorySlug)) return true;
  const haystack = [
    product.name,
    product.slug,
    product.sku,
    product.description,
    product.categoryName,
    product.brandName ?? "",
    ...(product.tags ?? []),
  ].join(" ");
  return GAS_TEXT.test(haystack);
}

function isGasBanner(banner: Banner): boolean {
  return GAS_TEXT.test(`${banner.title} ${banner.subtitle} ${banner.link}`);
}

function isGasCoupon(coupon: Coupon): boolean {
  return /nl[-\s]?gas/i.test(coupon.code);
}

/** Drop NL-GAS / stove seed catalog; fall back to fashion samples if nothing remains. */
export function resolveMarketplaceProducts(
  serverProducts: Product[] | undefined | null
): Product[] {
  const cleaned = (serverProducts ?? [])
    .filter((p) => !isGasProduct(p))
    .map((p) =>
      /rukza/i.test(p.brandName ?? "")
        ? { ...p, brandName: DEFAULT_SETTINGS.storeName }
        : p
    );
  return cleaned.length > 0 ? cleaned : seedProducts;
}

export function resolveMarketplaceBanners(
  serverBanners: Banner[] | undefined | null
): Banner[] {
  const cleaned = (serverBanners ?? []).filter((b) => !isGasBanner(b));
  return cleaned.length > 0 ? cleaned : seedBanners;
}

export function resolveMarketplaceCoupons(
  serverCoupons: Coupon[] | undefined | null
): Coupon[] {
  const cleaned = (serverCoupons ?? []).filter((c) => !isGasCoupon(c));
  return cleaned.length > 0 ? cleaned : seedCoupons;
}

/** Replace leftover gas / RukZa branding from Blob with NexCart X defaults. */
export function resolveMarketplaceSettings(
  settings: SiteSettings | undefined | null
): SiteSettings {
  const merged = { ...DEFAULT_SETTINGS, ...(settings ?? {}) };
  const brandBlob = `${merged.storeName} ${merged.tagline} ${merged.description} ${merged.topBarMessage} ${merged.email}`;
  if (GAS_TEXT.test(brandBlob) || LEGACY_STORE_NAME.test(brandBlob)) {
    return {
      ...merged,
      storeName: DEFAULT_SETTINGS.storeName,
      tagline: DEFAULT_SETTINGS.tagline,
      description: DEFAULT_SETTINGS.description,
      email: DEFAULT_SETTINGS.email,
      topBarMessage: DEFAULT_SETTINGS.topBarMessage,
    };
  }
  return merged;
}

export function resolveMarketplaceHomePanels(
  panels: HomePanelsConfig | undefined | null
): HomePanelsConfig {
  if (!panels) return DEFAULT_HOME_PANELS;
  const blob = JSON.stringify(panels);
  if (GAS_TEXT.test(blob)) {
    return DEFAULT_HOME_PANELS;
  }
  return panels;
}
