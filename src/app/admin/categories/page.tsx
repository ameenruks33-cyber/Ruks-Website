"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Save } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminCategoriesPage() {
  const { categories, updateCategory } = useCatalogStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [saved, setSaved] = useState(false);

  const startEdit = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      setForm({
        name: cat.name,
        description: cat.description ?? "",
        image: cat.image ?? "",
      });
      setEditingId(id);
    }
  };

  const handleSave = () => {
    if (!editingId) return;
    updateCategory(editingId, {
      name: form.name,
      description: form.description || undefined,
      image: form.image || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Categories</h1>
      <p className="text-charcoal/60 mb-8">Edit category names, descriptions, and photos</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-sm border border-cream-dark overflow-hidden">
            {cat.image && (
              <div className="relative h-32 bg-cream-dark">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="33vw" unoptimized />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold">{cat.name}</h3>
              <p className="text-sm text-charcoal/50 mt-1 line-clamp-2">{cat.description}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => startEdit(cat.id)}>
                <Pencil size={14} />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-charcoal/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-lg space-y-4">
            <h2 className="font-semibold text-lg">Edit Category</h2>
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input label="Photo URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
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
