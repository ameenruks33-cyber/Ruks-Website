import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api";
import type { CreateOrderPayload } from "@/lib/order-types";
import { createOrder, getOrder, listOrders, markWhatsAppNotified } from "@/lib/order-storage";
import { getStoreCatalog } from "@/lib/catalog-storage";
import { sendOrderWhatsAppNotification } from "@/lib/whatsapp-notify";
import {
  assertSameOrigin,
  buildTrustedOrderPayload,
  consumeRateLimit,
  emailsMatch,
  getClientIp,
  toPublicOrder,
} from "@/lib/security";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber");
  const email = searchParams.get("email");

  if (orderNumber) {
    const ip = getClientIp(request);
    const limit = consumeRateLimit(`order-lookup:${ip}`, 8, 15 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many lookups. Try again later." },
        { status: 429 }
      );
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

    if (await isAdminRequest()) {
      return NextResponse.json({ order });
    }
    return NextResponse.json({ order: toPublicOrder(order) });
  }

  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(request);
  const limit = consumeRateLimit(`order-create:${ip}`, 10, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many orders from this network. Try again later." },
      { status: 429 }
    );
  }

  let body: CreateOrderPayload;
  try {
    body = (await request.json()) as CreateOrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const catalog = await getStoreCatalog();
  const trusted = buildTrustedOrderPayload(body, catalog);
  if (!trusted.ok) {
    return NextResponse.json({ error: trusted.error }, { status: 400 });
  }

  const order = await createOrder(trusted.data);

  const whatsapp = await sendOrderWhatsAppNotification(order);
  if (whatsapp.sent) {
    await markWhatsAppNotified(order.orderNumber);
    order.whatsappNotified = true;
  }

  // Never expose owner WhatsApp link or env error details to shoppers
  return NextResponse.json(
    {
      success: true,
      order: toPublicOrder(order),
      orderNumber: order.orderNumber,
    },
    { status: 201 }
  );
}
