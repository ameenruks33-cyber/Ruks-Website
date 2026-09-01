"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Cloud, CloudOff, Loader2 } from "lucide-react";
import { onCatalogSyncStatus } from "@/lib/catalog-sync";

export function AdminSyncStatus() {
  const [status, setStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;

    return onCatalogSyncStatus((next) => {
      setStatus(next);
      if (next === "synced") {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => setStatus("idle"), 3000);
      }
    });
  }, []);

  if (status === "idle") {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-charcoal/40">
        <Cloud size={14} />
        Changes auto-publish to website
      </span>
    );
  }

  if (status === "syncing") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-charcoal/60">
        <Loader2 size={14} className="animate-spin" />
        Publishing...
      </span>
    );
  }

  if (status === "synced") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-green-600">
        <CheckCircle size={14} />
        Live on website
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-red-500">
      <CloudOff size={14} />
      Publish failed
    </span>
  );
}
