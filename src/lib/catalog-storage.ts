import { promises as fs } from "fs";
import path from "path";
import {
  products as seedProducts,
  categories as seedCategories,
  banners as seedBanners,
  coupons as seedCoupons,
} from "@/data/store";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { DEFAULT_HOME_PANELS, normalizeHomePanels } from "@/lib/home-panels";
import { DEFAULT_SOCIAL_CONNECTIONS } from "@/types/marketing";
import {
  isBlobStorageEnabled,
  readCatalogFromBlob,
  writeCatalogToBlob,
} from "@/lib/blob-catalog-storage";
import { resolveMarketplaceCategories } from "@/lib/category-resolve";
import {
  resolveMarketplaceBanners,
  resolveMarketplaceCoupons,
  resolveMarketplaceHomePanels,
  resolveMarketplaceProducts,
  resolveMarketplaceSettings,
} from "@/lib/product-resolve";
import type { StoreCatalogData, StoreCatalogPatch } from "@/lib/store-data-types";

const DATA_DIR = path.join(process.cwd(), "data");
const CATALOG_FILE = path.join(DATA_DIR, "store-catalog.json");

const globalCache = globalThis as typeof globalThis & {
  __rukzaCatalogCache__?: StoreCatalogData;
};

function getSeedData(): StoreCatalogData {
  return {
    products: seedProducts,
    categories: seedCategories,
    banners: seedBanners,
    coupons: seedCoupons,
    settings: DEFAULT_SETTINGS,
    homePanels: DEFAULT_HOME_PANELS,
    marketingPosts: [],
    socialConnections: DEFAULT_SOCIAL_CONNECTIONS,
    updatedAt: new Date(0).toISOString(),
  };
}

function normalizeCatalog(parsed: StoreCatalogData): StoreCatalogData {
  return {
    ...getSeedData(),
    ...parsed,
    products: resolveMarketplaceProducts(parsed.products ?? seedProducts),
    categories: resolveMarketplaceCategories(parsed.categories ?? seedCategories),
    banners: resolveMarketplaceBanners(parsed.banners ?? seedBanners),
    coupons: resolveMarketplaceCoupons(parsed.coupons ?? seedCoupons),
    settings: resolveMarketplaceSettings({
      ...DEFAULT_SETTINGS,
      ...parsed.settings,
    }),
    homePanels: resolveMarketplaceHomePanels(
      normalizeHomePanels(parsed.homePanels)
    ),
    marketingPosts: parsed.marketingPosts ?? [],
    socialConnections: {
      ...DEFAULT_SOCIAL_CONNECTIONS,
      ...parsed.socialConnections,
    },
    updatedAt: parsed.updatedAt ?? new Date().toISOString(),
  };
}

async function ensureCatalogFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(CATALOG_FILE);
  } catch {
    const seed = getSeedData();
    seed.updatedAt = new Date().toISOString();
    await fs.writeFile(CATALOG_FILE, JSON.stringify(seed, null, 2), "utf-8");
  }
}

async function readCatalogFile(): Promise<StoreCatalogData | null> {
  try {
    await ensureCatalogFile();
    const raw = await fs.readFile(CATALOG_FILE, "utf-8");
    return normalizeCatalog(JSON.parse(raw) as StoreCatalogData);
  } catch {
    return null;
  }
}

async function writeCatalogFile(data: StoreCatalogData): Promise<void> {
  await ensureCatalogFile();
  await fs.writeFile(CATALOG_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function readCatalog(): Promise<StoreCatalogData> {
  if (globalCache.__rukzaCatalogCache__) {
    const cached = normalizeCatalog(globalCache.__rukzaCatalogCache__);
    globalCache.__rukzaCatalogCache__ = cached;
    return cached;
  }

  if (isBlobStorageEnabled()) {
    const fromBlob = await readCatalogFromBlob();
    if (fromBlob) {
      const catalog = normalizeCatalog(fromBlob);
      globalCache.__rukzaCatalogCache__ = catalog;
      return catalog;
    }
  }

  if (!process.env.VERCEL) {
    const fromFile = await readCatalogFile();
    if (fromFile) {
      globalCache.__rukzaCatalogCache__ = fromFile;
      return fromFile;
    }
  }

  const seed = getSeedData();
  seed.updatedAt = new Date().toISOString();
  globalCache.__rukzaCatalogCache__ = seed;
  return seed;
}

async function writeCatalog(data: StoreCatalogData): Promise<void> {
  globalCache.__rukzaCatalogCache__ = data;

  if (isBlobStorageEnabled()) {
    await writeCatalogToBlob(data);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Vercel Blob is not connected. Add Blob storage in Vercel project settings so admin changes save on the live website."
    );
  }

  await writeCatalogFile(data);
}

export function getCatalogStorageMode(): "blob" | "file" | "memory" {
  if (isBlobStorageEnabled()) return "blob";
  if (!process.env.VERCEL) return "file";
  return "memory";
}

export async function getStoreCatalog(): Promise<StoreCatalogData> {
  return readCatalog();
}

export async function updateStoreCatalog(
  patch: StoreCatalogPatch
): Promise<StoreCatalogData> {
  const current = await readCatalog();
  const next: StoreCatalogData = {
    products: resolveMarketplaceProducts(patch.products ?? current.products),
    categories: resolveMarketplaceCategories(patch.categories ?? current.categories),
    banners: resolveMarketplaceBanners(patch.banners ?? current.banners),
    coupons: resolveMarketplaceCoupons(patch.coupons ?? current.coupons),
    settings: resolveMarketplaceSettings(
      patch.settings
        ? { ...current.settings, ...patch.settings }
        : current.settings
    ),
    homePanels: resolveMarketplaceHomePanels(
      patch.homePanels
        ? normalizeHomePanels({ ...current.homePanels, ...patch.homePanels })
        : current.homePanels
    ),
    marketingPosts: patch.marketingPosts ?? current.marketingPosts,
    socialConnections: patch.socialConnections
      ? { ...current.socialConnections, ...patch.socialConnections }
      : current.socialConnections,
    updatedAt: new Date().toISOString(),
  };
  await writeCatalog(next);
  return next;
}

export async function getProductsFromStore() {
  const data = await readCatalog();
  return data.products.filter((p) => p.isActive);
}

export async function getCategoriesFromStore() {
  const data = await readCatalog();
  return data.categories;
}
