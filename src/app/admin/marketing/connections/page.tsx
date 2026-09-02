"use client";

import Link from "next/link";
import { ArrowLeft, Camera, MessageCircle, Share2 } from "lucide-react";
import { useMarketingStore } from "@/store/marketing-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SocialConnectionsPage() {
  const { socialConnections, updateSocialConnections } = useMarketingStore();

  const save = async () => {
    await syncCatalogNow();
    alert("Saved. Full API integration comes in Phase 3.");
  };

  return (
    <div>
      <Link
        href="/admin/marketing"
        className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-burgundy mb-6"
      >
        <ArrowLeft size={16} />
        Back to Marketing
      </Link>

      <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Social Connections</h1>
      <p className="text-charcoal/60 mb-8">
        Phase 3 will connect Instagram Graph API and WhatsApp Business API. For now, use copy &amp;
        manual send from each marketing post.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
          <div className="flex items-center gap-2">
            <Camera size={20} className="text-burgundy" />
            <h2 className="font-semibold">Instagram</h2>
          </div>
          <p className="text-sm text-charcoal/60">Requires Business account + Meta Developer App</p>
          <Input
            label="Account name (for display)"
            value={socialConnections.instagram.accountName ?? ""}
            onChange={(e) =>
              updateSocialConnections({
                instagram: { connected: false, accountName: e.target.value },
              })
            }
          />
          <p className="text-xs text-charcoal/50">Auto-publish: Phase 3</p>
        </section>

        <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-burgundy" />
            <h2 className="font-semibold">WhatsApp</h2>
          </div>
          <p className="text-sm text-charcoal/60">
            Order alerts use WHATSAPP_NOTIFY_PHONE. Marketing broadcasts: Phase 4 (Business API).
          </p>
          <Input
            label="Business phone"
            value={socialConnections.whatsapp.phone ?? ""}
            onChange={(e) =>
              updateSocialConnections({
                whatsapp: { connected: false, phone: e.target.value },
              })
            }
          />
        </section>

        <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
          <div className="flex items-center gap-2">
            <Share2 size={20} className="text-burgundy" />
            <h2 className="font-semibold">Facebook</h2>
          </div>
          <p className="text-sm text-charcoal/60">Requires Facebook Page linked to your store</p>
          <Input
            label="Page name (for display)"
            value={socialConnections.facebook.pageName ?? ""}
            onChange={(e) =>
              updateSocialConnections({
                facebook: { connected: false, pageName: e.target.value },
              })
            }
          />
          <p className="text-xs text-charcoal/50">Auto-publish: Phase 3</p>
        </section>
      </div>

      <Button className="mt-8" onClick={save}>
        Save Connections
      </Button>
    </div>
  );
}
