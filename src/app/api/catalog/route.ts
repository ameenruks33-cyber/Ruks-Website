import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api";
import { getStoreCatalog, updateStoreCatalog } from "@/lib/catalog-storage";
import type { StoreCatalogPatch } from "@/lib/store-data-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getStoreCatalog();
  return NextResponse.json(catalog, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
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

  const catalog = await updateStoreCatalog(body);
  return NextResponse.json({ success: true, catalog });
}
