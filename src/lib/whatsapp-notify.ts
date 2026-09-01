import type { StoredOrder } from "@/lib/order-types";

function formatMoney(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}

export function formatOrderWhatsAppMessage(order: StoredOrder): string {
  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.name}${item.size ? ` (${item.size})` : ""} ×${item.quantity} — ${formatMoney(item.price * item.quantity, order.totals.currency)}`
    )
    .join("\n");

  const addressLines = [
    order.address.line1,
    order.address.line2,
    order.address.city,
    order.address.postalCode,
    order.address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    "🛍️ *NEW ORDER - RukZa's Fashion Hub*",
    "",
    `*Order:* ${order.orderNumber}`,
    `*Date:* ${new Date(order.createdAt).toLocaleString("en-AE")}`,
    "",
    `*Customer:* ${order.customer.fullName}`,
    `*Phone:* ${order.customer.phone}`,
    `*Email:* ${order.customer.email}`,
    "",
    "*Items:*",
    itemsText,
    "",
    `*Shipping:* ${order.shipping.methodName} (${formatMoney(order.shipping.cost, order.totals.currency)})`,
    `*Address:* ${addressLines}`,
    `*Payment:* ${order.payment.methodName}`,
    order.totals.couponCode ? `*Coupon:* ${order.totals.couponCode}` : null,
    "",
    `*Total:* ${formatMoney(order.totals.total, order.totals.currency)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function getOwnerWhatsAppPhone(): string | null {
  const fromEnv = process.env.WHATSAPP_NOTIFY_PHONE?.trim();
  if (fromEnv) return normalizePhone(fromEnv);

  const waUrl = process.env.WHATSAPP_NOTIFY_URL?.trim();
  if (waUrl) {
    const match = waUrl.match(/wa\.me\/(\d+)/);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function buildOwnerWhatsAppLink(message: string, phone?: string): string | null {
  const targetPhone = phone ? normalizePhone(phone) : getOwnerWhatsAppPhone();
  if (!targetPhone) return null;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

export async function sendOrderWhatsAppNotification(
  order: StoredOrder
): Promise<{ sent: boolean; link?: string; error?: string }> {
  const message = formatOrderWhatsAppMessage(order);
  const phone = getOwnerWhatsAppPhone();
  const link = buildOwnerWhatsAppLink(message, phone ?? undefined);

  if (!phone) {
    return {
      sent: false,
      link: link ?? undefined,
      error: "WHATSAPP_NOTIFY_PHONE is not set in environment variables",
    };
  }

  const apiKey = process.env.CALLMEBOT_API_KEY?.trim();
  if (apiKey) {
    try {
      const url = new URL("https://api.callmebot.com/whatsapp.php");
      url.searchParams.set("phone", phone);
      url.searchParams.set("text", message);
      url.searchParams.set("apikey", apiKey);

      const response = await fetch(url.toString(), { method: "GET" });
      if (response.ok) {
        return { sent: true, link: link ?? undefined };
      }

      const body = await response.text();
      return {
        sent: false,
        link: link ?? undefined,
        error: body || "CallMeBot request failed",
      };
    } catch (error) {
      return {
        sent: false,
        link: link ?? undefined,
        error: error instanceof Error ? error.message : "WhatsApp send failed",
      };
    }
  }

  return {
    sent: false,
    link: link ?? undefined,
    error: "Set CALLMEBOT_API_KEY for automatic WhatsApp alerts (optional)",
  };
}
