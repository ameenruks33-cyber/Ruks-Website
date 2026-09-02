import type { Product } from "@/types";
import type { MarketingPost } from "@/types/marketing";
import { generateMarketingContent } from "@/lib/marketing-content-generator";
import { useMarketingStore } from "@/store/marketing-store";
import { useSettingsStore } from "@/store/settings-store";

function createPostId(): string {
  return `mkt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createMarketingDraftFromProduct(
  product: Product,
  options?: {
    trigger?: MarketingPost["trigger"];
    channels?: Partial<MarketingPost["channels"]>;
    force?: boolean;
  }
): MarketingPost | null {
  const store = useMarketingStore.getState();
  const settings = useSettingsStore.getState();
  const shopUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!options?.force) {
    const existing = store.marketingPosts.find(
      (p) =>
        p.productId === product.id &&
        p.status !== "published" &&
        p.trigger === (options?.trigger ?? (product.isNew ? "new_arrival" : "manual"))
    );
    if (existing) return existing;
  }

  const content = generateMarketingContent({
    product,
    storeName: settings.storeName,
    currency: settings.currency,
    shopUrl,
    trigger: options?.trigger,
    channels: options?.channels,
  });

  const now = new Date().toISOString();
  const post: MarketingPost = {
    id: createPostId(),
    productId: product.id,
    productName: product.name,
    productSlug: product.slug,
    productImage: product.images[0] ?? "",
    productPrice: product.price,
    productSalePrice: product.salePrice,
    trigger: content.trigger,
    channels: content.channels,
    instagramCaption: content.instagramCaption,
    hashtags: content.hashtags,
    whatsappMessage: content.whatsappMessage,
    facebookCaption: content.facebookCaption,
    reelScript: content.reelScript,
    status: "draft",
    stockLevel: content.stockLevel,
    createdAt: now,
    updatedAt: now,
  };

  store.addPost(post);
  return post;
}

export function maybeCreateNewArrivalDraft(product: Product, wasNew: boolean): void {
  if (!product.isNew || wasNew) return;
  createMarketingDraftFromProduct(product, { trigger: "new_arrival" });
}
