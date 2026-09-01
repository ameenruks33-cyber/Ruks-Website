import { NextResponse } from "next/server";
import { getCategoriesFromStore } from "@/lib/catalog-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await getCategoriesFromStore();
  return NextResponse.json(categories);
}
