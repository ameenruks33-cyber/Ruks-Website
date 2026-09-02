export type MarketingTrigger =
  | "manual"
  | "new_arrival"
  | "low_stock"
  | "back_in_stock"
  | "clearance";

export type MarketingStatus =
  | "draft"
  | "approved"
  | "scheduled"
  | "published"
  | "failed";

export interface MarketingChannels {
  instagram: boolean;
  whatsapp: boolean;
  facebook: boolean;
  website: boolean;
}

export interface MarketingPost {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  productPrice: number;
  productSalePrice?: number;
  trigger: MarketingTrigger;
  channels: MarketingChannels;
  instagramCaption: string;
  hashtags: string[];
  whatsappMessage: string;
  facebookCaption: string;
  reelScript: string;
  status: MarketingStatus;
  scheduledAt?: string;
  publishedAt?: string;
  publishError?: string;
  stockLevel?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SocialConnections {
  instagram: { connected: boolean; accountName?: string };
  whatsapp: { connected: boolean; phone?: string };
  facebook: { connected: boolean; pageName?: string };
}

export const DEFAULT_SOCIAL_CONNECTIONS: SocialConnections = {
  instagram: { connected: false },
  whatsapp: { connected: false },
  facebook: { connected: false },
};

export const DEFAULT_MARKETING_CHANNELS: MarketingChannels = {
  instagram: true,
  whatsapp: true,
  facebook: false,
  website: true,
};
