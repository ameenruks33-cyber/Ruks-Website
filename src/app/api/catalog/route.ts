import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api";
import { getStoreCatalog, updateStoreCatalog, getCatalogStorageMode } from "@/lib/catalog-storage";
import type { StoreCatalogPatch } from "@/lib/store-data-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getStoreCatalog();
  return NextResponse.json(
    { ...catalog, storage: getCatalogStorageMode() },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as StoreCatalogPatch;

  if (
    !body.products &&
    !body.categories &&
    !body.banners &&
    !body.coupons &&
    !body.settings
  ) {
    return NextResponse.json({ error: "No catalog data provided" }, { status: 400 });
  }

  try {
    const catalog = await updateStoreCatalog(body);
    return NextResponse.json({
      success: true,
      catalog,
      storage: getCatalogStorageMode(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save catalog to live website",
      },
      { status: 500 }
    );
  }
}
