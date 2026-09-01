import { NextResponse } from "next/server";
import {
  getStoreCatalog,
} from "@/lib/catalog-storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const filter = searchParams.get("filter");
  const q = searchParams.get("q");

  const catalog = await getStoreCatalog();
  let result = catalog.products.filter((p) => p.isActive);

  if (q) {
    const query = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.includes(query)) ||
        p.categoryName.toLowerCase().includes(query)
    );
  } else if (category) {
    const childSlugs = catalog.categories
      .filter((c) => c.parentSlug === category)
      .map((c) => c.slug);
    const allSlugs = [category, ...childSlugs];
    result = result.filter((p) => allSlugs.includes(p.categorySlug));
  } else if (filter === "new") {
    result = result.filter((p) => p.isNew);
  } else if (filter === "offers") {
    result = result.filter((p) => p.salePrice);
  } else if (filter === "bestsellers") {
    result = result.filter((p) => p.isFeatured);
  }

  return NextResponse.json(result);
}
