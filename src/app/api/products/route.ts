import { NextResponse } from "next/server";
import { products, getProductsByCategory, searchProducts, getNewArrivals, getOnSaleProducts } from "@/data/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const filter = searchParams.get("filter");
  const q = searchParams.get("q");

  let result = products.filter((p) => p.isActive);

  if (q) result = searchProducts(q);
  else if (category) result = getProductsByCategory(category);
  else if (filter === "new") result = getNewArrivals();
  else if (filter === "offers") result = getOnSaleProducts();
  else if (filter === "bestsellers") result = products.filter((p) => p.isFeatured);

  return NextResponse.json(result);
}
