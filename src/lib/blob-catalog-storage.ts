import { head, put } from "@vercel/blob";
import type { StoreCatalogData } from "@/lib/store-data-types";

const BLOB_PATHNAME = "rukza/store-catalog.json";

export function isBlobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function readCatalogFromBlob(): Promise<StoreCatalogData | null> {
  if (!isBlobStorageEnabled()) return null;

  try {
    const meta = await head(BLOB_PATHNAME);
    const response = await fetch(meta.url, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as StoreCatalogData;
  } catch {
    return null;
  }
}

export async function writeCatalogToBlob(data: StoreCatalogData): Promise<void> {
  if (!isBlobStorageEnabled()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  await put(BLOB_PATHNAME, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
