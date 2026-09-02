"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  CheckCircle,
  Send,
  Copy,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useMarketingStore } from "@/store/marketing-store";
import { useCatalogStore } from "@/store/catalog-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import { generateMarketingContent } from "@/lib/marketing-content-generator";
import { getInstagramCaptionForPost } from "@/lib/marketing-publish";
import { useSettingsStore } from "@/store/settings-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { MarketingPost } from "@/types/marketing";

interface MarketingEditPageProps {
  params: Promise<{ id: string }>;
}

export default function MarketingEditPage({ params }: MarketingEditPageProps) {
  const router = useRouter();
  const marketingPosts = useMarketingStore((s) => s.marketingPosts);
  const getPostById = useMarketingStore((s) => s.getPostById);
  const updatePost = useMarketingStore((s) => s.updatePost);
  const approvePost = useMarketingStore((s) => s.approvePost);
  const schedulePost = useMarketingStore((s) => s.schedulePost);
  const deletePost = useMarketingStore((s) => s.deletePost);
  const getProductById = useCatalogStore((s) => s.getProductById);
  const [postId, setPostId] = useState<string | null>(null);
  const [form, setForm] = useState<MarketingPost | null>(null);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<
    { channel: string; message: string; link?: string }[]
  >([]);
  const settings = useSettingsStore();

  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setPostId(p.id));
  }, [params]);

  useEffect(() => {
    if (!postId) return;
    const post = marketingPosts.find((p) => p.id === postId) ?? getPostById(postId);
    if (post) setForm({ ...post });
  }, [postId, marketingPosts, getPostById]);

  if (!postId || !form) {
    return <div className="p-8">Loading...</div>;
  }

  const update = <K extends keyof MarketingPost>(key: K, value: MarketingPost[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateChannel = (channel: keyof MarketingPost["channels"], enabled: boolean) => {
    setForm((prev) =>
      prev ? { ...prev, channels: { ...prev.channels, [channel]: enabled } } : prev
    );
  };

  const handleRegenerate = () => {
    const product = getProductById(form.productId);
    if (!product) return;
    const shopUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const content = generateMarketingContent({
      product,
      storeName: settings.storeName,
      currency: settings.currency,
      shopUrl,
      trigger: form.trigger,
      channels: form.channels,
    });
    setForm((prev) =>
      prev
        ? {
            ...prev,
            instagramCaption: content.instagramCaption,
            hashtags: content.hashtags,
            whatsappMessage: content.whatsappMessage,
            facebookCaption: content.facebookCaption,
            reelScript: content.reelScript,
            stockLevel: content.stockLevel,
          }
        : prev
    );
  };

  const handleSave = async () => {
    updatePost(form.id, form);
    await syncCatalogNow();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleApprove = async () => {
    updatePost(form.id, { ...form, status: "approved" });
    approvePost(form.id);
    await syncCatalogNow();
    setForm((prev) => (prev ? { ...prev, status: "approved" } : prev));
  };

  const handleSchedule = async () => {
    if (!form.scheduledAt) {
      alert("Set a schedule date and time first.");
      return;
    }
    updatePost(form.id, { ...form, status: "scheduled", scheduledAt: form.scheduledAt });
    schedulePost(form.id, form.scheduledAt);
    await syncCatalogNow();
    setForm((prev) => (prev ? { ...prev, status: "scheduled" } : prev));
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishResults([]);
    try {
      await handleSave();
      const res = await fetch("/api/marketing/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId: form.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Publish failed");
        return;
      }
      setPublishResults(data.results ?? []);
      setForm((prev) =>
        prev ? { ...prev, status: "published", publishedAt: new Date().toISOString() } : prev
      );
    } finally {
      setPublishing(false);
    }
  };

  const copyText = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const instagramFull = getInstagramCaptionForPost(form);

  return (
    <div>
      <Link
        href="/admin/marketing"
        className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-burgundy mb-6"
      >
        <ArrowLeft size={16} />
        Back to Marketing
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {form.productImage && (
            <div className="relative w-16 h-20 rounded-sm overflow-hidden bg-cream-dark">
              <Image src={form.productImage} alt="" fill className="object-cover" unoptimized />
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl font-bold text-charcoal">{form.productName}</h1>
            <p className="text-sm text-charcoal/60 capitalize">
              {form.trigger.replace("_", " ")} · {form.status}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleRegenerate}>
            <RefreshCw size={16} />
            Regenerate
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save size={16} />
            {saved ? "Saved!" : "Save"}
          </Button>
          {form.status === "draft" && (
            <Button variant="secondary" onClick={handleApprove}>
              <CheckCircle size={16} />
              Approve
            </Button>
          )}
          <Button onClick={handlePublish} disabled={publishing}>
            <Send size={16} />
            {publishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Instagram Caption</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyText(instagramFull, "instagram")}
              >
                <Copy size={14} />
                {copied === "instagram" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <textarea
              value={form.instagramCaption}
              onChange={(e) => update("instagramCaption", e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-cream-dark rounded-sm text-sm"
            />
            <Input
              label="Hashtags (comma separated)"
              value={form.hashtags.join(", ")}
              onChange={(e) =>
                update(
                  "hashtags",
                  e.target.value.split(",").map((h) => h.trim().replace(/^#/, "")).filter(Boolean)
                )
              }
            />
          </section>

          <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">WhatsApp Message</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyText(form.whatsappMessage, "whatsapp")}
              >
                <Copy size={14} />
                {copied === "whatsapp" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <textarea
              value={form.whatsappMessage}
              onChange={(e) => update("whatsappMessage", e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-cream-dark rounded-sm text-sm"
            />
          </section>

          <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
            <h2 className="font-semibold text-lg">Facebook Caption</h2>
            <textarea
              value={form.facebookCaption}
              onChange={(e) => update("facebookCaption", e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-cream-dark rounded-sm text-sm"
            />
          </section>

          <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
            <h2 className="font-semibold text-lg">Reel Script (Phase 5)</h2>
            <p className="text-xs text-charcoal/50">Auto video creation coming in Phase 5</p>
            <textarea
              value={form.reelScript}
              onChange={(e) => update("reelScript", e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-cream-dark rounded-sm text-sm font-mono"
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
            <h2 className="font-semibold text-lg">Publish to</h2>
            {(
              [
                ["instagram", "Instagram"],
                ["whatsapp", "WhatsApp"],
                ["facebook", "Facebook"],
                ["website", "Website"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.channels[key]}
                  onChange={(e) => updateChannel(key, e.target.checked)}
                  className="accent-burgundy"
                />
                {label}
              </label>
            ))}
          </section>

          <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
            <h2 className="font-semibold text-lg">Schedule (Phase 5)</h2>
            <input
              type="datetime-local"
              value={form.scheduledAt ? form.scheduledAt.slice(0, 16) : ""}
              onChange={(e) =>
                update("scheduledAt", e.target.value ? new Date(e.target.value).toISOString() : undefined)
              }
              className="w-full px-4 py-3 border border-cream-dark rounded-sm"
            />
            <Button variant="outline" className="w-full" onClick={handleSchedule}>
              Schedule Post
            </Button>
          </section>

          {publishResults.length > 0 && (
            <section className="bg-burgundy/5 p-4 rounded-sm border border-burgundy/20 space-y-2">
              <p className="font-medium text-sm text-burgundy">Publish results</p>
              {publishResults.map((r) => (
                <div key={r.channel} className="text-sm">
                  <p className="font-medium capitalize">{r.channel}</p>
                  <p className="text-charcoal/70">{r.message}</p>
                  {r.link && (
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-burgundy hover:underline mt-1"
                    >
                      Open <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </section>
          )}

          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => {
              if (confirm("Delete this marketing post?")) {
                deletePost(form.id);
                syncCatalogNow();
                router.push("/admin/marketing");
              }
            }}
          >
            <Trash2 size={16} />
            Delete Post
          </Button>
        </div>
      </div>
    </div>
  );
}
