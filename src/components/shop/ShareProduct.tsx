"use client";

import { useState } from "react";
import { Share2, MessageCircle, Link2, Check } from "lucide-react";
import { useSettingsStore } from "@/store/settings-store";
import { Button } from "@/components/ui/Button";

interface ShareProductProps {
  productName: string;
  productSlug: string;
  price: number;
}

export function ShareProduct({ productName, productSlug, price }: ShareProductProps) {
  const [copied, setCopied] = useState(false);
  const { storeName, whatsappUrl, facebookUrl, formatPrice } = useSettingsStore();

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/shop/${productSlug}`
    : `/shop/${productSlug}`;

  const shareText = `Check out ${productName} at ${storeName}! Only ${formatPrice(price)} — ${url}`;

  const shareWhatsApp = () => {
    const wa = whatsappUrl.includes("wa.me")
      ? `https://wa.me/?text=${encodeURIComponent(shareText)}`
      : `${whatsappUrl}?text=${encodeURIComponent(shareText)}`;
    window.open(wa, "_blank");
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-t border-cream-dark pt-6 mt-6">
      <p className="text-sm font-medium text-charcoal mb-3 flex items-center gap-2">
        <Share2 size={16} />
        Share &amp; help us grow
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={shareWhatsApp}>
          <MessageCircle size={16} />
          WhatsApp
        </Button>
        <Button variant="outline" size="sm" onClick={shareFacebook}>
          <Share2 size={16} />
          Facebook
        </Button>
        <Button variant="outline" size="sm" onClick={copyLink}>
          {copied ? <Check size={16} /> : <Link2 size={16} />}
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>
    </div>
  );
}
