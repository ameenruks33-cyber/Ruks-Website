import type { NextRequest } from "next/server";
import type { Coupon, Product } from "@/types";
import type { SiteSettings } from "@/lib/settings";
import type { HomePanelsConfig } from "@/lib/home-panels";
import type {
  CreateOrderPayload,
  OrderItem,
  PublicOrderView,
  StoredOrder,
} from "@/lib/order-types";
import type { StoreCatalogData } from "@/lib/store-data-types";
import { DEFAULT_SOCIAL_CONNECTIONS } from "@/types/marketing";
import { SHIPPING_METHODS } from "@/lib/constants";
import {
  isAllowedMapsEmbed,
  isSafeInternalHref,
  safeAdminRedirectPath,
} from "@/lib/safe-url";

export { isAllowedMapsEmbed, isSafeInternalHref, safeAdminRedirectPath };

const attempts = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) {
    const parts = vercel.split(",").map((p) => p.trim()).filter(Boolean);
    return parts[parts.length - 1] || "unknown";
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    return parts[parts.length - 1] || "unknown";
  }
  return "unknown";
}

/** Simple durable-enough-for-edge rate limit (best-effort on serverless). */
export function consumeRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (entry.count >= maxAttempts) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  entry.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

export function assertSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin navigations / non-browser
  try {
    const app = new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
    const req = new URL(origin);
    if (req.host === app.host) return true;
    const host = request.headers.get("host");
    if (host && req.host === host) return true;
    // Vercel preview / production hosts
    if (host && req.hostname.endsWith(".vercel.app") && host.endsWith(".vercel.app")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function toPublicOrder(order: StoredOrder): PublicOrderView {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      color: item.color,
      image: item.image,
    })),
    shipping: {
      methodName: order.shipping.methodName,
      cost: order.shipping.cost,
    },
    payment: {
      methodName: order.payment.methodName,
    },
    totals: {
      subtotal: order.totals.subtotal,
      discount: order.totals.discount,
      shipping: order.totals.shipping,
      total: order.totals.total,
      currency: order.totals.currency,
    },
    customer: {
      fullName: order.customer.fullName,
    },
  };
}

function unitPrice(product: Product): number {
  return typeof product.salePrice === "number" && product.salePrice > 0
    ? product.salePrice
    : product.price;
}

function applyCouponDiscount(
  code: string | undefined,
  subtotal: number,
  coupons: Coupon[]
): { discount: number; code?: string; error?: string } {
  if (!code?.trim()) return { discount: 0 };
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase() && (c.isActive ?? true)
  );
  if (!coupon) return { discount: 0, error: "Invalid coupon code" };
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return {
      discount: 0,
      error: `Minimum order of ₹${coupon.minOrder} required`,
    };
  }
  const discount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;
  return {
    discount: Math.min(Math.max(0, discount), subtotal),
    code: coupon.code.toUpperCase(),
  };
}

/** Rebuild order money/status on the server — never trust the client cart totals. */
export function buildTrustedOrderPayload(
  payload: CreateOrderPayload,
  catalog: StoreCatalogData
): { ok: true; data: CreateOrderPayload } | { ok: false; error: string } {
  if (!payload.items?.length) return { ok: false, error: "Cart is empty" };
  if (payload.items.length > 40) return { ok: false, error: "Too many items" };

  const email = String(payload.customer?.email || "").trim().toLowerCase();
  const fullName = String(payload.customer?.fullName || "").trim();
  const phone = String(payload.customer?.phone || "").trim();
  if (!email || !email.includes("@") || !fullName || phone.length < 8) {
    return { ok: false, error: "Invalid customer details" };
  }

  const line1 = String(payload.address?.line1 || "").trim();
  const city = String(payload.address?.city || "").trim();
  if (!line1 || !city) return { ok: false, error: "Delivery address is required" };

  const secureItems: OrderItem[] = [];
  for (const item of payload.items) {
    const qty = Math.floor(Number(item.quantity) || 0);
    if (!item.productId || qty < 1 || qty > 20) {
      return { ok: false, error: "Invalid item quantity" };
    }
    const product = catalog.products.find(
      (p) => p.id === item.productId && p.isActive
    );
    if (!product) return { ok: false, error: "One or more products are unavailable" };

    let price = unitPrice(product);
    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant || variant.stock < qty) {
        return { ok: false, error: `Insufficient stock for ${product.name}` };
      }
      if (typeof variant.price === "number" && variant.price > 0) {
        price = variant.price;
      }
    }

    secureItems.push({
      productId: product.id,
      variantId: item.variantId,
      name: product.name,
      quantity: qty,
      price,
      size: item.size,
      color: item.color,
      image: product.images[0],
    });
  }

  const subtotal = secureItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const coupon = applyCouponDiscount(
    payload.totals?.couponCode,
    subtotal,
    catalog.coupons
  );
  if (coupon.error && payload.totals?.couponCode) {
    return { ok: false, error: coupon.error };
  }

  const method = String(payload.shipping?.method || "standard");
  const known = SHIPPING_METHODS.find((m) => m.id === method);
  const settings = catalog.settings;
  let shippingCost = settings.standardShippingPrice;
  let methodName = known?.name ?? "Standard Delivery";
  if (method === "express") {
    shippingCost = settings.expressShippingPrice;
    methodName = known?.name ?? "Express Delivery";
  } else if (method === "pickup") {
    shippingCost = 0;
    methodName = known?.name ?? "Store Pickup";
  } else if (method === "standard") {
    shippingCost =
      subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingPrice;
  }

  const paymentMethod = String(payload.payment?.method || "cod");
  const paymentName =
    paymentMethod === "razorpay"
      ? "Pay Online (UPI / Card / Net Banking)"
      : paymentMethod === "whatsapp"
        ? "Order via WhatsApp"
        : "Cash on Delivery";

  const discount = coupon.discount;
  const total = Math.max(0, subtotal - discount + shippingCost);

  return {
    ok: true,
    data: {
      items: secureItems,
      customer: { email, fullName, phone },
      address: {
        line1,
        line2: String(payload.address?.line2 || "").trim() || undefined,
        city,
        postalCode: String(payload.address?.postalCode || "").trim() || undefined,
        country: String(payload.address?.country || "India").trim() || "India",
      },
      shipping: { method, methodName, cost: shippingCost },
      payment: { method: paymentMethod, methodName: paymentName },
      totals: {
        subtotal,
        discount,
        shipping: shippingCost,
        total,
        currency: settings.currency || "INR",
        couponCode: coupon.code,
      },
    },
  };
}

export function toPublicCatalog(catalog: StoreCatalogData): StoreCatalogData {
  const settings: SiteSettings = {
    ...catalog.settings,
    gstin: "",
  };

  const homePanels: HomePanelsConfig = catalog.homePanels;

  return {
    products: catalog.products.filter((p) => p.isActive),
    categories: catalog.categories,
    banners: catalog.banners,
    coupons: [], // never expose coupon list publicly — validate via /api/coupons/validate
    settings,
    homePanels,
    marketingPosts: [],
    socialConnections: DEFAULT_SOCIAL_CONNECTIONS,
    updatedAt: catalog.updatedAt,
  };
}

export function emailsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function requireHttpsRedirect(request: NextRequest): Response | null {
  if (process.env.NODE_ENV !== "production") return null;
  const proto = request.headers.get("x-forwarded-proto");
  if (proto === "http") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return Response.redirect(url, 308);
  }
  return null;
}
