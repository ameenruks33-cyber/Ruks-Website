import { NextResponse } from "next/server";
import { categories } from "@/data/store";

export async function GET() {
  return NextResponse.json(categories);
}
