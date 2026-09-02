"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Megaphone,
  Clock,
  CheckCircle,
  Send,
  Plus,
  Camera,
  MessageCircle,
  Share2,
  Globe,
} from "lucide-react";
import { useMarketingStore } from "@/store/marketing-store";
import { useCatalogStore } from "@/store/catalog-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import { createMarketingDraftFromProduct } from "@/lib/marketing-triggers";
import { MarketingPostEditor } from "@/components/admin/MarketingPostEditor";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { MarketingPost, MarketingStatus } from "@/types/marketing";

const STATUS_TABS: { label: string; value: MarketingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Approved", value: "approved" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
];

function statusClass(status: MarketingStatus) {
  switch (status) {
    case "draft":
      return "bg-cream-dark text-charcoal";
    case "approved":
      return "bg-gold/30 text-charcoal";
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "published":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-cream-dark text-charcoal";
  }
}

export default function AdminMarketingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-charcoal/70">Loading AI Marketing...</div>}>
      <AdminMarketingContent />
    </Suspense>
  );
}

function AdminMarketingContent() {
  const searchParams = useSearchParams();
  const { marketingPosts, socialConnections } = useMarketingStore();
  const products = useCatalogStore((s) => s.products);
  const [tab, setTab] = useState<MarketingStatus | "all">("all");
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [editingPost, setEditingPost] = useState<MarketingPost | null>(null);

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (!editId) return;
    const post = marketingPosts.find((p) => p.id === editId);
    if (post) setEditingPost(post);
  }, [searchParams, marketingPosts]);

  const today = new Date().toDateString();

  const stats = useMemo(() => {
    const pending = marketingPosts.filter(
      (p) => p.status === "draft" || p.status === "approved"
    ).length;
    const publishedToday = marketingPosts.filter(
      (p) => p.status === "published" && p.publishedAt?.startsWith(today.slice(0, 10))
    ).length;
    const scheduled = marketingPosts.filter((p) => p.status === "scheduled").length;
    return {
      total: marketingPosts.length,
      pending,
      publishedToday,
      scheduled,
    };
  }, [marketingPosts, today]);

  const filtered = useMemo(() => {
    if (tab === "all") return marketingPosts;
    return marketingPosts.filter((p) => p.status === tab);
  }, [marketingPosts, tab]);

  const handleCreateForProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const post = createMarketingDraftFromProduct(product, { force: true });
    if (!post) return;

    setShowProductPicker(false);
    setTab("draft");
    setEditingPost(post);
    void syncCatalogNow();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">AI Marketing</h1>
          <p className="text-charcoal/60">
            Product → AI content → Your approval → Publish to Instagram &amp; WhatsApp
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/marketing/connections">
            <Button variant="outline">Social Connections</Button>
          </Link>
          <Button onClick={() => setShowProductPicker(true)}>
            <Plus size={16} />
            Market a Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Posts", value: stats.total, icon: Megaphone },
          { label: "Pending Approval", value: stats.pending, icon: Clock },
          { label: "Published Today", value: stats.publishedToday, icon: CheckCircle },
          { label: "Scheduled", value: stats.scheduled, icon: Send },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-sm border border-cream-dark">
            <stat.icon size={20} className="text-burgundy mb-2" />
            <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
            <p className="text-sm text-charcoal/60">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-sm border border-cream-dark mb-6">
        <p className="text-sm font-medium text-charcoal mb-3">Channel connections</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <Camera size={16} />
            Instagram {socialConnections.instagram.connected ? "● Connected" : "○ Phase 3"}
          </span>
          <span className="flex items-center gap-2">
            <MessageCircle size={16} />
            WhatsApp {socialConnections.whatsapp.connected ? "● Connected" : "○ Manual send"}
          </span>
          <span className="flex items-center gap-2">
            <Share2 size={16} />
            Facebook {socialConnections.facebook.connected ? "● Connected" : "○ Phase 3"}
          </span>
          <span className="flex items-center gap-2">
            <Globe size={16} />
            Website ● Live
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
              tab === t.value
                ? "bg-burgundy text-cream border-burgundy"
                : "bg-white text-charcoal/70 border-cream-dark hover:border-burgundy"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-sm border border-cream-dark text-center">
          <Megaphone size={40} className="mx-auto text-charcoal/30 mb-4" />
          <p className="text-charcoal/60 mb-4">No marketing posts yet.</p>
          <Button onClick={() => setShowProductPicker(true)}>
            <Plus size={16} />
            Create your first post
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setEditingPost(post)}
              className="flex w-full gap-4 bg-white p-4 rounded-sm border border-cream-dark hover:border-burgundy transition-colors text-left"
            >
              {post.productImage && (
                <div className="relative w-16 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-cream-dark">
                  <Image
                    src={post.productImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-charcoal truncate">{post.productName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-sm font-semibold uppercase ${statusClass(post.status)}`}>
                    {post.status}
                  </span>
                  <Badge variant="new">{post.trigger.replace("_", " ")}</Badge>
                </div>
                <p className="text-sm text-charcoal/60 line-clamp-2">{post.instagramCaption}</p>
                <div className="flex gap-3 mt-2 text-xs text-charcoal/50">
                  {post.channels.instagram && <span>Instagram</span>}
                  {post.channels.whatsapp && <span>WhatsApp</span>}
                  {post.channels.facebook && <span>Facebook</span>}
                  {post.channels.website && <span>Website</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showProductPicker && (
        <div className="fixed inset-0 bg-charcoal/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="font-semibold text-lg mb-4">Select a product to market</h2>
            <div className="space-y-2">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleCreateForProduct(p.id)}
                  className="w-full flex items-center gap-3 p-3 border border-cream-dark rounded-sm hover:border-burgundy text-left"
                >
                  {p.images[0] && (
                    <div className="relative w-10 h-12 flex-shrink-0 rounded-sm overflow-hidden bg-cream-dark">
                      <Image src={p.images[0]} alt="" fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <span className="text-sm font-medium">{p.name}</span>
                </button>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setShowProductPicker(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {editingPost && (
        <MarketingPostEditor post={editingPost} onClose={() => setEditingPost(null)} />
      )}
    </div>
  );
}
