import { NextResponse } from "next/server";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();
  const { items, customer, shipping, payment } = body;

  if (!items?.length || !customer?.email) {
    return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
  }

  const orderNumber = generateOrderNumber();

  // In production: save to database, process payment via Stripe/PayTabs
  const order = {
    orderNumber,
    status: "PENDING",
    paymentStatus: payment?.method === "cod" ? "PENDING" : "PAID",
    items,
    customer,
    shipping,
    payment,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, order }, { status: 201 });
}
