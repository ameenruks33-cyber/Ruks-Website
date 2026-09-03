import { get, put } from "@vercel/blob";
import type { StoreCatalogData } from "@/lib/store-data-types";

const BLOB_PATHNAME = "nexcartx/store-catalog.json";
const LEGACY_BLOB_PATHNAME = "rukza/store-catalog.json";

export function isBlobStorageEnabled(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOB_STORE_ID ||
    (process.env.VERCEL && process.env.VERCEL_OIDC_TOKEN)
  );
}

async function readJsonFromPrivateBlob(pathname: string): Promise<StoreCatalogData | null> {
  try {
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result?.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as StoreCatalogData;
  } catch {
    return null;
  }
}

/** Fallback for older public blob until migrated. */
async function readJsonFromPublicHead(pathname: string): Promise<StoreCatalogData | null> {
  try {
    const { head } = await import("@vercel/blob");
    const meta = await head(pathname);
    const response = await fetch(meta.url, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as StoreCatalogData;
  } catch {
    return null;
  }
}

export async function readCatalogFromBlob(): Promise<StoreCatalogData | null> {
  if (!isBlobStorageEnabled()) return null;

  const privateNew = await readJsonFromPrivateBlob(BLOB_PATHNAME);
  if (privateNew) return privateNew;

  const privateLegacy = await readJsonFromPrivateBlob(LEGACY_BLOB_PATHNAME);
  if (privateLegacy) return privateLegacy;

  const publicLegacy = await readJsonFromPublicHead(LEGACY_BLOB_PATHNAME);
  if (publicLegacy) return publicLegacy;

  return readJsonFromPublicHead(BLOB_PATHNAME);
}

export async function writeCatalogToBlob(data: StoreCatalogData): Promise<void> {
  if (!isBlobStorageEnabled()) {
    throw new Error(
      "Blob storage is not connected. Run setup-vercel-auto.ps1 or connect Blob in Vercel dashboard."
    );
  }

  await put(BLOB_PATHNAME, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
