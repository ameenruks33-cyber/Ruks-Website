"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
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

interface MarketingPostEditorProps {
  post: MarketingPost;
  onClose: () => void;
}

export function MarketingPostEditor({ post: initialPost, onClose }: MarketingPostEditorProps) {
  const updatePost = useMarketingStore((s) => s.updatePost);
  const approvePost = useMarketingStore((s) => s.approvePost);
  const schedulePost = useMarketingStore((s) => s.schedulePost);
  const deletePost = useMarketingStore((s) => s.deletePost);
  const getProductById = useCatalogStore((s) => s.getProductById);
  const settings = useSettingsStore();

  const [form, setForm] = useState<MarketingPost>(initialPost);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<
    { channel: string; message: string; link?: string }[]
  >([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialPost);
  }, [initialPost]);

  const update = <K extends keyof MarketingPost>(key: K, value: MarketingPost[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateChannel = (channel: keyof MarketingPost["channels"], enabled: boolean) => {
    setForm((prev) => ({
      ...prev,
      channels: { ...prev.channels, [channel]: enabled },
    }));
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
    setForm((prev) => ({
      ...prev,
      instagramCaption: content.instagramCaption,
      hashtags: content.hashtags,
      whatsappMessage: content.whatsappMessage,
      facebookCaption: content.facebookCaption,
      reelScript: content.reelScript,
      stockLevel: content.stockLevel,
    }));
  };

  const handleSave = async () => {
    updatePost(form.id, form);
    void syncCatalogNow();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleApprove = async () => {
    updatePost(form.id, { ...form, status: "approved" });
    approvePost(form.id);
    setForm((prev) => ({ ...prev, status: "approved" }));
    void syncCatalogNow();
  };

  const handleSchedule = async () => {
    if (!form.scheduledAt) {
      alert("Set a schedule date and time first.");
      return;
    }
    updatePost(form.id, { ...form, status: "scheduled", scheduledAt: form.scheduledAt });
    schedulePost(form.id, form.scheduledAt);
    setForm((prev) => ({ ...prev, status: "scheduled" }));
    void syncCatalogNow();
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishResults([]);
    try {
      updatePost(form.id, form);
      await syncCatalogNow();
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
      setForm((prev) => ({
        ...prev,
        status: "published",
        publishedAt: new Date().toISOString(),
      }));
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
    <div className="fixed inset-0 z-50 flex flex-col bg-cream">
      <header className="flex items-center justify-between gap-4 border-b border-cream-dark bg-white px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {form.productImage && (
            <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden rounded-sm bg-cream-dark">
              <Image src={form.productImage} alt="" fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-charcoal">{form.productName}</p>
            <p className="text-xs capitalize text-charcoal/60">
              {form.trigger.replace("_", " ")} · {form.status}
            </p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRegenerate}>
            <RefreshCw size={14} />
            Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save size={14} />
            {saved ? "Saved!" : "Save"}
          </Button>
          {form.status === "draft" && (
            <Button variant="secondary" size="sm" onClick={handleApprove}>
              <CheckCircle size={14} />
              Approve
            </Button>
          )}
          <Button size="sm" onClick={handlePublish} disabled={publishing}>
            <Send size={14} />
            {publishing ? "Publishing..." : "Publish"}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-2 text-charcoal/60 hover:bg-cream-dark hover:text-charcoal"
            aria-label="Close editor"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="space-y-4 rounded-sm border border-cream-dark bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Instagram Caption</h2>
                <Button variant="outline" size="sm" onClick={() => copyText(instagramFull, "instagram")}>
                  <Copy size={14} />
                  {copied === "instagram" ? "Copied!" : "Copy"}
                </Button>
              </div>
              <textarea
                value={form.instagramCaption}
                onChange={(e) => update("instagramCaption", e.target.value)}
                rows={8}
                className="w-full rounded-sm border border-cream-dark px-4 py-3 text-sm"
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

            <section className="space-y-4 rounded-sm border border-cream-dark bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">WhatsApp Message</h2>
                <Button variant="outline" size="sm" onClick={() => copyText(form.whatsappMessage, "whatsapp")}>
                  <Copy size={14} />
                  {copied === "whatsapp" ? "Copied!" : "Copy"}
                </Button>
              </div>
              <textarea
                value={form.whatsappMessage}
                onChange={(e) => update("whatsappMessage", e.target.value)}
                rows={6}
                className="w-full rounded-sm border border-cream-dark px-4 py-3 text-sm"
              />
            </section>

            <section className="space-y-4 rounded-sm border border-cream-dark bg-white p-6">
              <h2 className="text-lg font-semibold">Facebook Caption</h2>
              <textarea
                value={form.facebookCaption}
                onChange={(e) => update("facebookCaption", e.target.value)}
                rows={5}
                className="w-full rounded-sm border border-cream-dark px-4 py-3 text-sm"
              />
            </section>
          </div>

          <div className="space-y-6">
            <section className="space-y-4 rounded-sm border border-cream-dark bg-white p-6">
              <h2 className="text-lg font-semibold">Publish to</h2>
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

            {publishResults.length > 0 && (
              <section className="space-y-2 rounded-sm border border-burgundy/20 bg-burgundy/5 p-4">
                <p className="text-sm font-medium text-burgundy">Publish results</p>
                {publishResults.map((r) => (
                  <div key={r.channel} className="text-sm">
                    <p className="font-medium capitalize">{r.channel}</p>
                    <p className="text-charcoal/70">{r.message}</p>
                    {r.link && (
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-burgundy hover:underline"
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
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => {
                if (confirm("Delete this marketing post?")) {
                  deletePost(form.id);
                  void syncCatalogNow();
                  onClose();
                }
              }}
            >
              <Trash2 size={16} />
              Delete Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
