import { promises as fs } from "fs";
import path from "path";
import type { CreateOrderPayload, OrderStatus, StoredOrder } from "@/lib/order-types";
import { generateOrderNumber } from "@/lib/utils";

const ORDERS_DIR = process.env.VERCEL
  ? path.join("/tmp", "nexcartx-data")
  : path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(ORDERS_DIR, "orders.json");

async function ensureOrdersFile(): Promise<void> {
  await fs.mkdir(ORDERS_DIR, { recursive: true });
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]", "utf-8");
  }
}

async function readOrders(): Promise<StoredOrder[]> {
  await ensureOrdersFile();
  const raw = await fs.readFile(ORDERS_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as StoredOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeOrders(orders: StoredOrder[]): Promise<void> {
  await ensureOrdersFile();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export async function listOrders(): Promise<StoredOrder[]> {
  const orders = await readOrders();
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrder(orderNumber: string): Promise<StoredOrder | undefined> {
  const orders = await readOrders();
  return orders.find(
    (order) => order.orderNumber.toLowerCase() === orderNumber.toLowerCase()
  );
}

export async function createOrder(payload: CreateOrderPayload): Promise<StoredOrder> {
  const orders = await readOrders();
  // Never spread raw payload — orderNumber/status must be server-owned
  const order: StoredOrder = {
    orderNumber: generateOrderNumber(),
    status: "CONFIRMED",
    items: payload.items,
    customer: payload.customer,
    address: payload.address,
    shipping: payload.shipping,
    payment: payload.payment,
    totals: payload.totals,
    createdAt: new Date().toISOString(),
    whatsappNotified: false,
  };
  orders.unshift(order);
  await writeOrders(orders);
  return order;
}

export async function updateOrderStatus(
  orderNumber: string,
  status: OrderStatus
): Promise<StoredOrder | undefined> {
  const orders = await readOrders();
  const index = orders.findIndex(
    (order) => order.orderNumber.toLowerCase() === orderNumber.toLowerCase()
  );
  if (index === -1) return undefined;

  orders[index] = { ...orders[index], status };
  await writeOrders(orders);
  return orders[index];
}

export async function markWhatsAppNotified(orderNumber: string): Promise<void> {
  const orders = await readOrders();
  const index = orders.findIndex(
    (order) => order.orderNumber.toLowerCase() === orderNumber.toLowerCase()
  );
  if (index === -1) return;

  orders[index] = { ...orders[index], whatsappNotified: true };
  await writeOrders(orders);
}
