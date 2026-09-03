import { NextResponse } from "next/server";
import { getStoreCatalog } from "@/lib/catalog-storage";
import { consumeRateLimit, getClientIp } from "@/lib/security";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = consumeRateLimit(`coupon:${ip}`, 30, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { valid: false, message: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  let code = "";
  let subtotal = 0;
  try {
    const body = await request.json();
    code = typeof body.code === "string" ? body.code : "";
    subtotal = typeof body.subtotal === "number" ? body.subtotal : 0;
  } catch {
    return NextResponse.json({ valid: false, message: "Invalid request" }, { status: 400 });
  }

  if (!code || subtotal < 0) {
    return NextResponse.json({ valid: false, message: "Invalid request" }, { status: 400 });
  }

  const catalog = await getStoreCatalog();
  const coupon = catalog.coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase() && (c.isActive ?? true)
  );
  if (!coupon) {
    return NextResponse.json({ valid: false, discount: 0, message: "Invalid coupon code" });
  }
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return NextResponse.json({
      valid: false,
      discount: 0,
      message: `Minimum order of ₹${coupon.minOrder} required`,
    });
  }

  const discount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;

  return NextResponse.json({
    valid: true,
    discount: Math.min(Math.max(0, discount), subtotal),
  });
}
