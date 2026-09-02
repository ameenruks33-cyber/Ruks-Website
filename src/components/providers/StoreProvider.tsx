"use client";

import { useEffect } from "react";
import {
  clearLegacyBrowserCatalogCache,
  loadCatalogFromServer,
} from "@/lib/catalog-sync";
import { useCatalogStore } from "@/store/catalog-store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    clearLegacyBrowserCatalogCache();

    const hydrateFailSafe = window.setTimeout(() => {
      useCatalogStore.setState({ hydrated: true });
    }, 2500);

    void loadCatalogFromServer(true).finally(() => {
      window.clearTimeout(hydrateFailSafe);
    });

    const refresh = () => {
      loadCatalogFromServer();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refresh();
    });

    const interval = window.setInterval(refresh, 30000);

    return () => {
      window.removeEventListener("focus", refresh);
      window.clearInterval(interval);
    };
  }, []);

  // Show the site immediately with built-in product data.
  // Live admin updates load in the background from /api/catalog.
  return <>{children}</>;
}
