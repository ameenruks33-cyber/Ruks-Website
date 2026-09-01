"use client";

import { useEffect, useState } from "react";
import {
  clearLegacyBrowserCatalogCache,
  loadCatalogFromServer,
} from "@/lib/catalog-sync";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    clearLegacyBrowserCatalogCache();

    const load = async () => {
      await loadCatalogFromServer(true);
      if (active) setReady(true);
    };

    load();

    const refresh = () => {
      loadCatalogFromServer();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refresh();
    });

    const interval = window.setInterval(refresh, 30000);

    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      window.clearInterval(interval);
    };
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-charcoal/50 text-sm">Loading store...</p>
      </div>
    );
  }

  return <>{children}</>;
}
