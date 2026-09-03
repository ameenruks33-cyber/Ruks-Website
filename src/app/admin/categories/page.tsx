"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Save, Plus, Trash2 } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import { slugify } from "@/lib/utils";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Category } from "@/types";

const EMPTY_CAT = { name: "", description: "", image: "", parentSlug: "" };

export default function AdminCategoriesPage() {
  const { categories, updateCategory, addCategory, deleteCategory } = useCatalogStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY_CAT);
  const [saved, setSaved] = useState(false);

  const parentCategories = categories.filter((c) => !c.parentSlug);

  const openNew = () => {
    setForm({ ...EMPTY_CAT });
    setEditingId(null);
    setIsNew(true);
  };

  const startEdit = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      setForm({
        name: cat.name,
        description: cat.description ?? "",
        image: cat.image ?? "",
        parentSlug: cat.parentSlug ?? "",
      });
      setEditingId(id);
      setIsNew(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;

    if (isNew) {
      const slug = slugify(form.name);
      const cat: Category = {
        id: `cat-${Date.now()}`,
        name: form.name.trim(),
        slug,
        description: form.description || undefined,
        image: form.image || undefined,
        parentSlug: form.parentSlug || undefined,
        sortOrder: categories.length + 1,
      };
      addCategory(cat);
    } else if (editingId) {
      updateCategory(editingId, {
        name: form.name.trim(),
        description: form.description || undefined,
        image: form.image || undefined,
        slug: slugify(form.name),
      });
    }

    await syncCatalogNow();
    setSaved(true);
    setEditingId(null);
    setIsNew(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    deleteCategory(id);
    await syncCatalogNow();
  };

  const modalOpen = isNew || editingId !== null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Categories</h1>
          <p className="text-charcoal/60">Edit or add shop categories and category photos</p>
        </div>
        <Button onClick={openNew}>
          <Plus size={16} />
          Add Category
        </Button>
      </div>

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
              <p className="text-xs text-charcoal/40">{cat.slug}</p>
              <p className="text-sm text-charcoal/50 mt-1 line-clamp-2">{cat.description}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => startEdit(cat.id)}>
                  <Pencil size={14} />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500"
                  onClick={() => handleDelete(cat.id, cat.name)}
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
            <h2 className="font-semibold text-lg">{isNew ? "Add Category" : "Edit Category"}</h2>
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {isNew && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Parent category (optional)</label>
                <select
                  value={form.parentSlug}
                  onChange={(e) => setForm({ ...form, parentSlug: e.target.value })}
                  className="w-full px-4 py-3 border border-cream-dark rounded-sm bg-white"
                >
                  <option value="">None — top level</option>
                  {parentCategories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
            <ImageField
              label="Category photo"
              value={form.image}
              onChange={(image) => setForm({ ...form, image })}
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
