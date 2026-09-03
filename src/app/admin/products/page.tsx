"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminProductsPage() {
  const { products, deleteProduct } = useCatalogStore();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteProduct(id);
    await syncCatalogNow();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Products</h1>
          <p className="text-charcoal/60">{products.length} products — add, edit names, photos, prices &amp; stock</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus size={18} />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-sm p-4 mb-6 text-sm text-charcoal/80">
        <strong>Tip:</strong> Click <strong>Edit</strong> to change product name, upload photos from your computer, set price and stock.
        Click <strong>Add Product</strong> to list anything new you sell.
      </div>

      <div className="bg-white rounded-sm border border-cream-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-dark/30">
            <tr>
              <th className="text-left p-4 font-medium text-charcoal/60">Product</th>
              <th className="text-left p-4 font-medium text-charcoal/60 hidden md:table-cell">Category</th>
              <th className="text-left p-4 font-medium text-charcoal/60">Price</th>
              <th className="text-left p-4 font-medium text-charcoal/60 hidden sm:table-cell">Stock</th>
              <th className="text-left p-4 font-medium text-charcoal/60 hidden sm:table-cell">Status</th>
              <th className="text-right p-4 font-medium text-charcoal/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={product.id} className="border-t border-cream-dark/50 hover:bg-cream-dark/10">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-cream-dark flex-shrink-0">
                        {product.images[0] && (
                          <Image src={product.images[0]} alt="" fill className="object-cover" sizes="48px" unoptimized />
                        )}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{product.name}</p>
                        <p className="text-xs text-charcoal/40">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-charcoal/60">{product.categoryName}</td>
                  <td className="p-4">
                    <Price amount={product.salePrice ?? product.price} className="font-medium" />
                    {product.salePrice && (
                      <Price amount={product.price} className="text-xs text-charcoal/40 line-through ml-2" />
                    )}
                  </td>
                  <td className="p-4 hidden sm:table-cell">{totalStock}</td>
                  <td className="p-4 hidden sm:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {product.isActive ? <Badge>Active</Badge> : <Badge variant="sale">Hidden</Badge>}
                      {product.isNew && <Badge variant="new">New</Badge>}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil size={14} />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-charcoal/50">No products yet. Click Add Product to start.</p>
        )}
      </div>
    </div>
  );
}
