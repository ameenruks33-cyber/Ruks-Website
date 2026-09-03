"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import { ProductForm } from "@/components/admin/ProductForm";
import { productToForm, formToProductPayload, EMPTY_PRODUCT_FORM } from "@/lib/product-form";
import { Button } from "@/components/ui/Button";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id ?? "";
  const router = useRouter();
  const { getProductById, updateProduct, deleteProduct, categories, hydrated } = useCatalogStore();
  const [form, setForm] = useState(EMPTY_PRODUCT_FORM);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const product = getProductById(productId);

  useEffect(() => {
    const p = getProductById(productId);
    if (p) setForm(productToForm(p));
  }, [productId, hydrated, getProductById]);

  if (!product && !hydrated) {
    return <div className="p-8">Loading...</div>;
  }

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

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }

    const payload = formToProductPayload(form, categories, product);
    updateProduct(productId, payload);

    const published = await syncCatalogNow();
    if (!published) {
      setError("Saved locally but publish failed. Check admin login.");
      return;
    }

    setError("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    deleteProduct(productId);
    await syncCatalogNow();
    router.push("/admin/products");
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

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl font-bold text-charcoal">Edit Product</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDelete} className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 size={16} />
            Delete
          </Button>
          <Button onClick={handleSave}>
            <Save size={16} />
            {saved ? "Published!" : "Save & Publish"}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <ProductForm form={form} categories={categories} onChange={setForm} />
    </div>
  );
}
