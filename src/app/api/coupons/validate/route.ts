import { NextResponse } from "next/server";
import { validateCoupon } from "@/data/store";

export async function POST(request: Request) {
  const { code, subtotal } = await request.json();
  if (!code || typeof subtotal !== "number") {
    return NextResponse.json({ valid: false, message: "Invalid request" }, { status: 400 });
  }
  const result = validateCoupon(code, subtotal);
  return NextResponse.json(result);
}
