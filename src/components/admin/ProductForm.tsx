"use client";

import Image from "next/image";
import type { ProductFormValues } from "@/lib/product-form";
import type { Category } from "@/types";
import { Input } from "@/components/ui/Input";
import { MultiImageField } from "@/components/admin/ImageField";
import { Price } from "@/components/ui/Price";

interface ProductFormProps {
  form: ProductFormValues;
  categories: Category[];
  onChange: (form: ProductFormValues) => void;
}

export function ProductForm({ form, categories, onChange }: ProductFormProps) {
  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    onChange({ ...form, [key]: value });
  };

  const displayPrice = form.salePrice ? Number(form.salePrice) : Number(form.price) || 0;
  const mainImage = form.images.find((u) => u.trim());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
          <h2 className="font-semibold text-lg">Product details</h2>
          <Input label="Product name *" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              placeholder="Describe the product — features, use, warranty info..."
              className="w-full px-4 py-3 border border-cream-dark rounded-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="SKU / Model (e.g. NL-GAS-DB201)" value={form.sku} onChange={(e) => set("sku", e.target.value)} />
            <Input label="Brand" value={form.brandName} onChange={(e) => set("brandName", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
            <select
              value={form.categorySlug}
              onChange={(e) => set("categorySlug", e.target.value)}
              className="w-full px-4 py-3 border border-cream-dark rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.parentSlug ? `— ${c.name}` : c.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Tags (comma separated — for search)"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="gas stove, double burner, nl-gas"
          />
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Features (one per line)</label>
            <textarea
              value={form.features}
              onChange={(e) => set("features", e.target.value)}
              rows={4}
              placeholder={"Brass burners\nISI certified\nAuto ignition"}
              className="w-full px-4 py-3 border border-cream-dark rounded-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            />
          </div>
          <Input label="Warranty" value={form.warranty} onChange={(e) => set("warranty", e.target.value)} placeholder="1 Year Warranty" />
        </section>

        <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
          <h2 className="font-semibold text-lg">Photos</h2>
          <p className="text-xs text-charcoal/50">
            Upload from your computer or paste a link. You can add multiple photos.
          </p>
          <MultiImageField images={form.images} onChange={(images) => set("images", images)} />
        </section>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
          <h2 className="font-semibold text-lg">Price &amp; stock</h2>
          <Input
            label="MRP / Price (₹) *"
            type="number"
            value={form.price || ""}
            onChange={(e) => set("price", Number(e.target.value))}
          />
          <Input
            label="Sale price (optional)"
            type="number"
            value={form.salePrice}
            onChange={(e) => set("salePrice", e.target.value)}
          />
          <Input
            label="Stock quantity"
            type="number"
            value={form.stock}
            onChange={(e) => set("stock", Number(e.target.value))}
          />
          <p className="text-sm text-charcoal/60">
            Customer sees: <Price amount={displayPrice} className="font-semibold text-charcoal" />
          </p>
        </section>

        <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-3">
          <h2 className="font-semibold text-lg mb-2">Show on website</h2>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="accent-burgundy" />
            Active — visible in shop
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="accent-burgundy" />
            Featured — homepage &amp; bestsellers
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isNew} onChange={(e) => set("isNew", e.target.checked)} className="accent-burgundy" />
            New arrival
          </label>
        </section>

        {mainImage && (
          <div className="relative aspect-square rounded-sm overflow-hidden bg-cream-dark border border-cream-dark">
            <Image src={mainImage} alt="Preview" fill className="object-cover" sizes="300px" unoptimized />
          </div>
        )}
      </div>
    </div>
  );
}
