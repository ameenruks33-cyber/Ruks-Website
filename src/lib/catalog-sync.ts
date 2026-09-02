import type { SiteSettings } from "@/lib/settings";
import type { StoreCatalogData } from "@/lib/store-data-types";
import { useCatalogStore } from "@/store/catalog-store";
import { useSettingsStore } from "@/store/settings-store";
import { useHomePanelsStore } from "@/store/home-panels-store";
import { useMarketingStore } from "@/store/marketing-store";
import { normalizeHomePanels } from "@/lib/home-panels";
import { DEFAULT_SOCIAL_CONNECTIONS } from "@/types/marketing";

type SyncListener = (status: "syncing" | "synced" | "error") => void;

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let syncListeners: SyncListener[] = [];
let lastServerUpdatedAt: string | null = null;

const LEGACY_STORAGE_KEYS = ["rukza-catalog", "rukza-settings"];

export function clearLegacyBrowserCatalogCache() {
  if (typeof window === "undefined") return;
  LEGACY_STORAGE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
}

export function onCatalogSyncStatus(listener: SyncListener) {
  syncListeners.push(listener);
  return () => {
    syncListeners = syncListeners.filter((l) => l !== listener);
  };
}

function notifySyncStatus(status: "syncing" | "synced" | "error") {
  syncListeners.forEach((listener) => listener(status));
}

export function pickSiteSettings(state: ReturnType<typeof useSettingsStore.getState>): SiteSettings {
  return {
    storeName: state.storeName,
    tagline: state.tagline,
    description: state.description,
    email: state.email,
    phone: state.phone,
    address: state.address,
    currency: state.currency,
    locale: state.locale,
    freeShippingThreshold: state.freeShippingThreshold,
    standardShippingPrice: state.standardShippingPrice,
    expressShippingPrice: state.expressShippingPrice,
    facebookUrl: state.facebookUrl,
    instagramUrl: state.instagramUrl,
    whatsappUrl: state.whatsappUrl,
    topBarMessage: state.topBarMessage,
  };
}

export function pickHomePanels(state: ReturnType<typeof useHomePanelsStore.getState>) {
  return normalizeHomePanels({
    dealsBar: state.dealsBar,
    promoBanner: state.promoBanner,
    newsletter: state.newsletter,
  });
}

export function getLocalCatalogPayload(): Omit<StoreCatalogData, "updatedAt"> {
  const catalog = useCatalogStore.getState();
  const settings = useSettingsStore.getState();
  const homePanels = useHomePanelsStore.getState();
  const marketing = useMarketingStore.getState();

  return {
    products: catalog.products,
    categories: catalog.categories,
    banners: catalog.banners,
    coupons: catalog.coupons,
    settings: pickSiteSettings(settings),
    homePanels: pickHomePanels(homePanels),
    marketingPosts: marketing.marketingPosts,
    socialConnections: marketing.socialConnections,
  };
}

export function hydrateStoresFromCatalog(data: StoreCatalogData) {
  useCatalogStore.setState({
    products: data.products,
    categories: data.categories,
    banners: data.banners,
    coupons: data.coupons,
    hydrated: true,
  });
  useSettingsStore.setState({
    ...data.settings,
  });
  useHomePanelsStore.getState().setHomePanels(
    normalizeHomePanels(data.homePanels)
  );
  useMarketingStore.getState().setMarketingData(
    data.marketingPosts ?? [],
    data.socialConnections ?? DEFAULT_SOCIAL_CONNECTIONS
  );
  lastServerUpdatedAt = data.updatedAt;
}

export async function fetchCatalogFromServer(): Promise<StoreCatalogData | null> {
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`/api/catalog?t=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    window.clearTimeout(timeout);

    if (!res.ok) return null;
    return (await res.json()) as StoreCatalogData;
  } catch {
    return null;
  }
}

export async function loadCatalogFromServer(force = false): Promise<boolean> {
  const data = await fetchCatalogFromServer();
  if (!data) {
    // Keep built-in seed data usable if the catalog API is slow or unavailable.
    useCatalogStore.setState({ hydrated: true });
    return false;
  }

  if (!force && lastServerUpdatedAt && data.updatedAt === lastServerUpdatedAt) {
    useCatalogStore.setState({ hydrated: true });
    return true;
  }

  hydrateStoresFromCatalog(data);
  return true;
}

export async function pushCatalogToServer(): Promise<boolean> {
  notifySyncStatus("syncing");
  try {
    const res = await fetch("/api/catalog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(getLocalCatalogPayload()),
    });
    if (!res.ok) {
      notifySyncStatus("error");
      return false;
    }
    const body = await res.json();
    if (body.catalog?.updatedAt) {
      lastServerUpdatedAt = body.catalog.updatedAt;
    }
    notifySyncStatus("synced");
    return true;
  } catch {
    notifySyncStatus("error");
    return false;
  }
}

export function scheduleCatalogSync(delayMs = 500) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    pushCatalogToServer();
  }, delayMs);
}

export async function syncCatalogNow(): Promise<boolean> {
  if (syncTimer) clearTimeout(syncTimer);
  return pushCatalogToServer();
}
