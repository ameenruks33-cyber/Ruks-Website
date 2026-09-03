"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import { ProductForm } from "@/components/admin/ProductForm";
import { EMPTY_PRODUCT_FORM, createProductFromForm } from "@/lib/product-form";
import { Button } from "@/components/ui/Button";

export default function NewProductPage() {
  const router = useRouter();
  const { categories, addProduct } = useCatalogStore();
  const [form, setForm] = useState({
    ...EMPTY_PRODUCT_FORM,
    categorySlug: categories.find((c) => !c.parentSlug)?.slug ?? "women-ethnic-wear",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!form.price || form.price <= 0) {
      setError("Enter a valid price");
      return;
    }

    setSaving(true);
    setError("");

    const product = createProductFromForm(form, categories);
    addProduct(product);

    const published = await syncCatalogNow();
    setSaving(false);

    if (!published) {
      setError("Saved locally but publish failed. Make sure you are logged in to admin.");
      return;
    }

    router.push(`/admin/products/${product.id}/edit`);
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
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Add New Product</h1>
          <p className="text-charcoal/60">Add any product you sell — name, photos, price, stock</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? "Publishing..." : "Save & Publish"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <ProductForm form={form} categories={categories} onChange={setForm} />
    </div>
  );
}
