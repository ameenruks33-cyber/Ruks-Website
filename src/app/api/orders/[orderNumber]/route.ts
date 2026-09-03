import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api";
import type { OrderStatus } from "@/lib/order-types";
import { getOrder, updateOrderStatus } from "@/lib/order-storage";
import {
  consumeRateLimit,
  emailsMatch,
  getClientIp,
  toPublicOrder,
} from "@/lib/security";

const VALID_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  const ip = getClientIp(request);
  const limit = consumeRateLimit(`order-lookup:${ip}`, 8, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many lookups. Try again later." },
      { status: 429 }
    );
  }

  if (await isAdminRequest()) {
    const order = await getOrder(orderNumber);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  }

  if (!email?.trim()) {
    return NextResponse.json(
      { error: "Email is required to track an order" },
      { status: 400 }
    );
  }

  const order = await getOrder(orderNumber);
  if (!order || !emailsMatch(order.customer.email, email)) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order: toPublicOrder(order) });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderNumber } = await params;
  const body = await request.json();
  const status = body.status as OrderStatus;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await updateOrderStatus(orderNumber, status);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}
