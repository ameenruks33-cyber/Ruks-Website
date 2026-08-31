"use client";

import { useState } from "react";
import Image from "next/image";
import { Save } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminBannersPage() {
  const { banners, updateBanner } = useCatalogStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", link: "" });
  const [saved, setSaved] = useState(false);

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
    }
  };

  const handleSave = () => {
    if (!editingId) return;
    updateBanner(editingId, {
      title: form.title,
      subtitle: form.subtitle || undefined,
      image: form.image,
      link: form.link || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Homepage Banners</h1>
      <p className="text-charcoal/60 mb-8">Change banner photos, titles, and links</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-sm border border-cream-dark overflow-hidden">
            <div className="relative h-40 bg-cream-dark">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" sizes="50vw" unoptimized />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{banner.title}</h3>
              {banner.subtitle && <p className="text-sm text-charcoal/60">{banner.subtitle}</p>}
              <Button variant="outline" size="sm" className="mt-3" onClick={() => startEdit(banner.id)}>
                Edit Banner
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-charcoal/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-lg">Edit Banner</h2>
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input label="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <Input label="Link (e.g. /shop?filter=offers)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
            {form.image && (
              <div className="relative h-32 rounded-sm overflow-hidden bg-cream-dark">
                <Image src={form.image} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave}>
                <Save size={16} />
                {saved ? "Saved!" : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
