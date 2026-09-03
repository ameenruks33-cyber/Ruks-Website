"use client";

import { useState } from "react";
import { Gift, Share2, Copy, Check, Users } from "lucide-react";
import { useSettingsStore } from "@/store/settings-store";
import { Button } from "@/components/ui/Button";

export default function ReferPage() {
  const { storeName, whatsappUrl } = useSettingsStore();
  const [copied, setCopied] = useState(false);

  const referralCode = "NCX10";
  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}?ref=${referralCode}`
    : `/?ref=${referralCode}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `Shop at ${storeName} and get 10% off! Use my link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <Gift size={48} className="mx-auto text-burgundy mb-4" />
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-3">
          Refer &amp; Earn
        </h1>
        <p className="text-charcoal/60">
          Share {storeName} with friends — like Meesho resellers! They get 10% off, you earn rewards.
        </p>
      </div>

      <div className="bg-white border border-cream-dark rounded-sm p-8 mb-8 text-center">
        <p className="text-sm text-charcoal/60 mb-2">Your Referral Code</p>
        <p className="text-3xl font-bold text-burgundy tracking-widest mb-6">{referralCode}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={copyLink}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy Referral Link"}
          </Button>
          <Button variant="outline" onClick={shareWhatsApp}>
            <Share2 size={16} />
            Share on WhatsApp
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { step: "1", title: "Share your link", desc: "Send to friends & family" },
          { step: "2", title: "They shop", desc: "They get 10% off first order" },
          { step: "3", title: "You earn", desc: "Get credit on every referral" },
        ].map((item) => (
          <div key={item.step} className="bg-white p-5 border border-cream-dark rounded-sm text-center">
            <span className="w-8 h-8 bg-gold text-charcoal rounded-full inline-flex items-center justify-center font-bold text-sm mb-3">
              {item.step}
            </span>
            <h3 className="font-semibold text-charcoal text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-charcoal/50">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-burgundy/5 border border-burgundy/20 rounded-sm p-6 flex items-start gap-4">
        <Users size={24} className="text-burgundy flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-charcoal mb-1">Become a Reseller (Meesho Style)</h3>
          <p className="text-sm text-charcoal/60">
            Share products on WhatsApp &amp; social media. Earn commission on every sale —
            no inventory needed. Perfect for students &amp; homemakers.
          </p>
        </div>
      </div>
    </div>
  );
}
