"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Price } from "@/components/ui/Price";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const { getProductById, updateProduct, categories, hydrated } = useCatalogStore();
  const [productId, setProductId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    salePrice: "" as string | number,
    sku: "",
    categorySlug: "",
    brandName: "",
    images: [""] as string[],
    isFeatured: false,
    isNew: false,
    isActive: true,
  });

  useEffect(() => {
    params.then((p) => setProductId(p.id));
  }, [params]);

  useEffect(() => {
    if (!productId) return;
    const product = getProductById(productId);
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice ?? "",
        sku: product.sku,
        categorySlug: product.categorySlug,
        brandName: product.brandName ?? "",
        images: product.images.length ? product.images : [""],
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        isActive: product.isActive,
      });
    }
  }, [productId, hydrated, getProductById]);

  if (!productId) return <div className="p-8">Loading...</div>;

  const product = getProductById(productId);
  if (!product) {
    return (
      <div className="p-8 text-center">
        <p>Product not found.</p>
        <Link href="/admin/products" className="text-burgundy hover:underline mt-2 inline-block">
          Back to products
        </Link>
      </div>
    );
  }

  const update = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateImage = (index: number, url: string) => {
    const images = [...form.images];
    images[index] = url;
    setForm((prev) => ({ ...prev, images }));
  };

  const addImage = () => setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));

  const removeImage = (index: number) => {
    const images = form.images.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, images: images.length ? images : [""] }));
  };

  const handleSave = async () => {
    const images = form.images.filter((url) => url.trim());
    updateProduct(productId, {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      sku: form.sku,
      categorySlug: form.categorySlug,
      brandName: form.brandName || undefined,
      images: images.length ? images : product.images,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      isActive: form.isActive,
    });

    const published = await syncCatalogNow();
    if (!published) {
      setSaveError("Saved locally but failed to publish. Check you are logged in to admin.");
      return;
    }

    setSaveError("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-burgundy mb-6"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-charcoal">Edit Product</h1>
        <Button onClick={handleSave}>
          <Save size={16} />
          {saved ? "Published!" : "Save & Publish"}
        </Button>
      </div>
      {saveError && (
        <p className="text-sm text-red-500 mb-4">{saveError}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
            <h2 className="font-semibold text-lg">Basic Info</h2>
            <Input label="Product Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-cream-dark rounded-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="SKU" value={form.sku} onChange={(e) => update("sku", e.target.value)} />
              <Input label="Brand" value={form.brandName} onChange={(e) => update("brandName", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
              <select
                value={form.categorySlug}
                onChange={(e) => update("categorySlug", e.target.value)}
                className="w-full px-4 py-3 border border-cream-dark rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Product Photos</h2>
              <Button variant="outline" size="sm" onClick={addImage}>
                <Plus size={14} />
                Add Photo
              </Button>
            </div>
            <p className="text-xs text-charcoal/50">
              Paste an image URL (from your computer upload to Google Drive, Cloudinary, or any image host)
            </p>
            {form.images.map((url, i) => (
              <div key={i} className="flex gap-3 items-start">
                {url && (
                  <div className="relative w-16 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-cream-dark">
                    <Image src={url} alt="" fill className="object-cover" sizes="64px" unoptimized />
                  </div>
                )}
                <Input
                  label={i === 0 ? "Main Photo URL" : `Photo ${i + 1} URL`}
                  value={url}
                  onChange={(e) => updateImage(i, e.target.value)}
                  className="flex-1"
                />
                {form.images.length > 1 && (
                  <button
                    onClick={() => removeImage(i)}
                    className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-sm"
                    aria-label="Remove photo"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-4">
            <h2 className="font-semibold text-lg">Pricing</h2>
            <Input
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value))}
            />
            <Input
              label="Sale Price (optional)"
              type="number"
              value={form.salePrice}
              onChange={(e) => update("salePrice", e.target.value)}
            />
            <p className="text-sm text-charcoal/60">
              Display price: <Price amount={form.salePrice ? Number(form.salePrice) : form.price} className="font-semibold text-charcoal" />
            </p>
          </section>

          <section className="bg-white p-6 rounded-sm border border-cream-dark space-y-3">
            <h2 className="font-semibold text-lg mb-2">Visibility</h2>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} className="accent-burgundy" />
              Active (visible in store)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} className="accent-burgundy" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isNew} onChange={(e) => update("isNew", e.target.checked)} className="accent-burgundy" />
              New Arrival
            </label>
          </section>

          {form.images[0] && (
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-cream-dark">
              <Image src={form.images[0]} alt="Preview" fill className="object-cover" sizes="300px" unoptimized />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
