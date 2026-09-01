import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api";
import type { CreateOrderPayload } from "@/lib/order-types";
import { createOrder, getOrder, listOrders, markWhatsAppNotified } from "@/lib/order-storage";
import { sendOrderWhatsAppNotification } from "@/lib/whatsapp-notify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber");

  if (orderNumber) {
    const order = await getOrder(orderNumber);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  }

  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateOrderPayload;
  const { items, customer, address, shipping, payment, totals } = body;

  if (!items?.length || !customer?.email || !customer?.fullName || !customer?.phone) {
    return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
  }

  if (!address?.line1 || !address?.city) {
    return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
  }

  const order = await createOrder({
    items,
    customer,
    address,
    shipping,
    payment,
    totals,
  });

  const whatsapp = await sendOrderWhatsAppNotification(order);
  if (whatsapp.sent) {
    await markWhatsAppNotified(order.orderNumber);
    order.whatsappNotified = true;
  }

  return NextResponse.json(
    {
      success: true,
      order,
      whatsapp: {
        sent: whatsapp.sent,
        link: whatsapp.link,
        error: whatsapp.error,
      },
    },
    { status: 201 }
  );
}
