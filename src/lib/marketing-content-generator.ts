import type { Product } from "@/types";
import type { MarketingChannels, MarketingTrigger } from "@/types/marketing";
import { DEFAULT_MARKETING_CHANNELS } from "@/types/marketing";

export interface MarketingContentInput {
  product: Product;
  storeName: string;
  currency: string;
  shopUrl: string;
  trigger?: MarketingTrigger;
  channels?: Partial<MarketingChannels>;
}

export interface GeneratedMarketingContent {
  instagramCaption: string;
  hashtags: string[];
  whatsappMessage: string;
  facebookCaption: string;
  reelScript: string;
  channels: MarketingChannels;
  trigger: MarketingTrigger;
  stockLevel: number;
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items.filter(Boolean))];
}

function getTotalStock(product: Product): number {
  if (product.variants?.length) {
    return product.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  }
  return 0;
}

function getSizes(product: Product): string[] {
  return unique(product.variants?.map((v) => v.size).filter(Boolean) as string[]);
}

function getColors(product: Product): string[] {
  return unique(product.variants?.map((v) => v.color).filter(Boolean) as string[]);
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function buildHashtags(product: Product, trigger: MarketingTrigger): string[] {
  const base = [
    "NewArrival",
    "WomensFashion",
    "UAEFashion",
    "DubaiFashion",
    "ModestFashion",
    "ShopNow",
    "FashionHub",
  ];

  const categoryTag = product.categoryName.replace(/\s+/g, "");
  if (categoryTag) base.unshift(categoryTag);

  product.tags.slice(0, 4).forEach((tag) => {
    base.push(tag.replace(/\s+/g, ""));
  });

  if (trigger === "low_stock") base.unshift("LimitedStock");
  if (trigger === "back_in_stock") base.unshift("BackInStock");
  if (trigger === "clearance") base.unshift("Sale", "Clearance");

  return unique(base.map((h) => (h.startsWith("#") ? h.slice(1) : h))).slice(0, 15);
}

function stockHook(stock: number, trigger: MarketingTrigger): string {
  if (trigger === "low_stock" || stock <= 2) {
    return "⚡ ALMOST SOLD OUT — Only a few pieces left!";
  }
  if (stock <= 5) {
    return "🔥 LIMITED STOCK — Grab yours before it's gone!";
  }
  if (trigger === "back_in_stock") {
    return "🔥 BACK IN STOCK — Restocked and ready to ship!";
  }
  if (trigger === "new_arrival") {
    return "✨ NEW ARRIVAL — Just dropped!";
  }
  return "✨ Now available on our store!";
}

export function detectMarketingTrigger(
  product: Product,
  previousStock?: number
): MarketingTrigger {
  const stock = getTotalStock(product);
  if (previousStock === 0 && stock > 0) return "back_in_stock";
  if (stock > 0 && stock <= 5) return "low_stock";
  if (product.isNew) return "new_arrival";
  if (product.salePrice && product.salePrice < product.price) return "clearance";
  return "manual";
}

export function generateMarketingContent(
  input: MarketingContentInput
): GeneratedMarketingContent {
  const { product, storeName, currency, shopUrl } = input;
  const trigger = input.trigger ?? detectMarketingTrigger(product);
  const stock = getTotalStock(product);
  const sizes = getSizes(product);
  const colors = getColors(product);
  const displayPrice = product.salePrice ?? product.price;
  const priceText = formatMoney(displayPrice, currency);
  const productUrl = `${shopUrl.replace(/\/$/, "")}/shop/${product.slug}`;
  const hook = stockHook(stock, trigger);

  const sizeLine = sizes.length ? `Sizes: ${sizes.join(", ")}` : "";
  const colorLine = colors.length ? `Colors: ${colors.join(", ")}` : "";
  const detailLines = [sizeLine, colorLine].filter(Boolean).join("\n");

  const instagramCaption = [
    hook,
    "",
    `👗 ${product.name}`,
    product.description.split(".").at(0)?.trim() || product.description.slice(0, 120),
    "",
    detailLines,
    `💰 ${priceText}`,
    "",
    `🛍️ Shop now at ${storeName}`,
    `🔗 ${productUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  const hashtagLine = buildHashtags(product, trigger)
    .map((h) => `#${h}`)
    .join(" ");

  const whatsappMessage = [
    hook,
    "",
    `*${product.name}*`,
    detailLines,
    `Price: *${priceText}*`,
    "",
    `Shop here: ${productUrl}`,
    "",
    `_Message from ${storeName}_`,
  ]
    .filter(Boolean)
    .join("\n");

  const facebookCaption = [
    hook,
    "",
    `${product.name} — ${priceText}`,
    product.description.slice(0, 160),
    "",
    `Shop now: ${productUrl}`,
  ].join("\n");

  const reelScript = [
    "[0-2s] Hook text on screen:",
    hook,
    "",
    "[2-5s] Product name + main photo:",
    product.name,
    "",
    "[5-8s] Details overlay:",
    [sizeLine, colorLine, `From ${priceText}`].filter(Boolean).join(" | "),
    "",
    "[8-10s] CTA:",
    `Shop Now → ${storeName}`,
  ].join("\n");

  return {
    instagramCaption,
    hashtags: buildHashtags(product, trigger),
    whatsappMessage,
    facebookCaption,
    reelScript,
    channels: { ...DEFAULT_MARKETING_CHANNELS, ...input.channels },
    trigger,
    stockLevel: stock,
  };
}

export function appendHashtagsToCaption(caption: string, hashtags: string[]): string {
  const tagLine = hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ");
  if (caption.includes(tagLine)) return caption;
  return `${caption.trim()}\n\n${tagLine}`;
}
