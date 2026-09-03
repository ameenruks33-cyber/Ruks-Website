"use client";

import { useState } from "react";
import Image from "next/image";
import { Save, Plus, Trash2 } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Banner } from "@/types";

const EMPTY_BANNER = { title: "", subtitle: "", image: "", link: "/shop" };

export default function AdminBannersPage() {
  const { banners, updateBanner, addBanner, deleteBanner } = useCatalogStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY_BANNER);
  const [saved, setSaved] = useState(false);

  const openNew = () => {
    setForm({ ...EMPTY_BANNER });
    setEditingId(null);
    setIsNew(true);
  };

  const startEdit = (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (banner) {
      setForm({
        title: banner.title,
        subtitle: banner.subtitle ?? "",
        image: banner.image,
        link: banner.link ?? "",
      });
      setEditingId(id);
      setIsNew(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.image.trim()) return;

    if (isNew) {
      const banner: Banner = {
        id: `banner-${Date.now()}`,
        title: form.title,
        subtitle: form.subtitle || undefined,
        image: form.image,
        link: form.link || undefined,
      };
      addBanner(banner);
    } else if (editingId) {
      updateBanner(editingId, {
        title: form.title,
        subtitle: form.subtitle || undefined,
        image: form.image,
        link: form.link || undefined,
      });
    }

    await syncCatalogNow();
    setSaved(true);
    setEditingId(null);
    setIsNew(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    deleteBanner(id);
    await syncCatalogNow();
    setEditingId(null);
    setIsNew(false);
  };

  const modalOpen = isNew || editingId !== null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Homepage Banners</h1>
          <p className="text-charcoal/60">Change slider photos, titles and buttons — or add new banners</p>
        </div>
        <Button onClick={openNew}>
          <Plus size={16} />
          Add Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-sm border border-cream-dark overflow-hidden">
            <div className="relative h-44 bg-cream-dark">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" sizes="50vw" unoptimized />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{banner.title}</h3>
              {banner.subtitle && <p className="text-sm text-charcoal/60">{banner.subtitle}</p>}
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => startEdit(banner.id)}>
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500"
                  onClick={() => handleDelete(banner.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-charcoal/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-lg">{isNew ? "Add Banner" : "Edit Banner"}</h2>
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input label="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            <ImageField
              label="Banner photo"
              value={form.image}
              onChange={(image) => setForm({ ...form, image })}
              hint="Upload from computer or paste URL — this is the big homepage slider image"
            />
            <Input
              label="Button link"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="/shop or /shop?category=gas-stoves"
            />
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave}>
                <Save size={16} />
                {saved ? "Saved!" : "Save & Publish"}
              </Button>
              <Button variant="outline" onClick={() => { setEditingId(null); setIsNew(false); }}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
