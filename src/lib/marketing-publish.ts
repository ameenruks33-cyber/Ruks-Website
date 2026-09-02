import type { MarketingPost, SocialConnections } from "@/types/marketing";
import { appendHashtagsToCaption } from "@/lib/marketing-content-generator";
import { buildOwnerWhatsAppLink } from "@/lib/whatsapp-notify";

export interface PublishResult {
  channel: keyof MarketingPost["channels"];
  success: boolean;
  message: string;
  link?: string;
}

export function getInstagramCaptionForPost(post: MarketingPost): string {
  return appendHashtagsToCaption(post.instagramCaption, post.hashtags);
}

export function publishMarketingPost(
  post: MarketingPost,
  connections: SocialConnections,
  ownerPhone?: string
): PublishResult[] {
  const results: PublishResult[] = [];

  if (post.channels.website) {
    results.push({
      channel: "website",
      success: true,
      message: "Product is live on your website when marked Active.",
    });
  }

  if (post.channels.whatsapp) {
    const link = buildOwnerWhatsAppLink(post.whatsappMessage, ownerPhone);
    results.push({
      channel: "whatsapp",
      success: Boolean(link),
      message: link
        ? "WhatsApp message ready — open link to send (manual send for now)."
        : "Set WHATSAPP_NOTIFY_PHONE in env vars to generate WhatsApp link.",
      link: link ?? undefined,
    });
  }

  if (post.channels.instagram) {
    if (connections.instagram.connected) {
      results.push({
        channel: "instagram",
        success: false,
        message:
          "Instagram API connected — auto-publish coming in Phase 3. Copy caption for now.",
      });
    } else {
      results.push({
        channel: "instagram",
        success: false,
        message:
          "Instagram not connected yet. Copy the caption and post manually, or connect in Social Connections (Phase 3).",
      });
    }
  }

  if (post.channels.facebook) {
    if (connections.facebook.connected) {
      results.push({
        channel: "facebook",
        success: false,
        message: "Facebook API connected — auto-publish coming in Phase 3.",
      });
    } else {
      results.push({
        channel: "facebook",
        success: false,
        message: "Facebook not connected. Copy caption or connect in Phase 3.",
      });
    }
  }

  return results;
}
