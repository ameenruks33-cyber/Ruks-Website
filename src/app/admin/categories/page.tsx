"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Save, Plus, Trash2, RefreshCw } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import { categories as seedCategories } from "@/data/category-tree";
import { needsCategoryTreeUpgrade } from "@/lib/category-resolve";
import { slugify } from "@/lib/utils";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Category } from "@/types";

const EMPTY_CAT = { name: "", description: "", image: "", parentSlug: "" };

export default function AdminCategoriesPage() {
  const categories = useCatalogStore((s) => s.categories);
  const hydrated = useCatalogStore((s) => s.hydrated);
  const updateCategory = useCatalogStore((s) => s.updateCategory);
  const addCategory = useCatalogStore((s) => s.addCategory);
  const deleteCategory = useCatalogStore((s) => s.deleteCategory);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY_CAT);
  const [saved, setSaved] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [autoFixed, setAutoFixed] = useState(false);

  const parents = useMemo(
    () => categories.filter((c) => !c.parentSlug).sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  );

  const restoreFullList = async (silent = false) => {
    setRestoring(true);
    try {
      useCatalogStore.setState({ categories: seedCategories });
      await syncCatalogNow();
      if (!silent) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setRestoring(false);
    }
  };

  useEffect(() => {
    if (!hydrated || autoFixed) return;
    if (needsCategoryTreeUpgrade(categories)) {
      setAutoFixed(true);
      void restoreFullList(true);
    } else {
      setAutoFixed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, categories, autoFixed]);

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
        parentSlug: form.parentSlug || undefined,
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
  const childCount = categories.filter((c) => c.parentSlug).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Categories</h1>
          <p className="text-charcoal/60">
            {parents.length} main categories · {childCount} sub-items · {categories.length} total
          </p>
          <p className="text-xs text-charcoal/40 mt-1">Admin categories v2026-09-03</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => restoreFullList(false)} disabled={restoring}>
            <RefreshCw size={16} className={restoring ? "animate-spin" : ""} />
            {restoring ? "Loading..." : "Load full category list"}
          </Button>
          <Button onClick={openNew}>
            <Plus size={16} />
            Add Category
          </Button>
        </div>
      </div>

      {saved && (
        <p className="mb-4 text-sm text-burgundy font-medium">
          Full category list is now saved in the admin catalog.
        </p>
      )}

      {!hydrated && (
        <p className="mb-4 text-sm text-charcoal/50">Loading categories...</p>
      )}

      <div className="space-y-6">
        {parents.map((parent) => {
          const children = categories
            .filter((c) => c.parentSlug === parent.slug)
            .sort((a, b) => a.sortOrder - b.sortOrder);

          return (
            <section
              key={parent.id}
              className="bg-surface border border-cream-dark rounded-sm overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4 border-b border-cream-dark bg-ink/40">
                {parent.image && (
                  <div className="relative w-14 h-14 flex-shrink-0 rounded-sm overflow-hidden bg-cream-dark">
                    <Image
                      src={parent.image}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-lg font-bold text-burgundy">{parent.name}</h2>
                  <p className="text-xs text-charcoal/50">
                    {children.length} items · /shop?category={parent.slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(parent.id)}>
                    <Pencil size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(parent.id, parent.name)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              <ul className="divide-y divide-cream-dark/60">
                {children.map((child) => (
                  <li
                    key={child.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-cream-dark/30"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-burgundy flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal">{child.name}</p>
                      <p className="text-xs text-charcoal/40">{child.slug}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(child.id)}>
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(child.id, child.name)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </li>
                ))}
                {children.length === 0 && (
                  <li className="px-4 py-3 text-sm text-charcoal/50">No sub-items yet</li>
                )}
              </ul>
            </section>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-cream-dark rounded-sm p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-lg mb-4 text-charcoal">
              {isNew ? "Add Category" : "Edit Category"}
            </h2>
            <div className="space-y-4">
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <Input
                label="Description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Parent category (optional)
                </label>
                <select
                  value={form.parentSlug}
                  onChange={(e) => setForm((prev) => ({ ...prev, parentSlug: e.target.value }))}
                  className="w-full px-4 py-3 border border-cream-dark rounded-sm bg-surface text-charcoal"
                >
                  <option value="">— Main category —</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <ImageField
                label="Image"
                value={form.image}
                onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button className="flex-1" onClick={handleSave}>
                <Save size={16} />
                Save
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsNew(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
