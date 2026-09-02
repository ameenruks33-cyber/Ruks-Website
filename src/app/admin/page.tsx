"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { Price } from "@/components/ui/Price";
import type { StoredOrder } from "@/lib/order-types";

const STATS = [
  { label: "Total Products", key: "products" as const, icon: Package, change: "Editable in admin" },
  { label: "Active Categories", key: "categories" as const, icon: TrendingUp, change: "Editable in admin" },
  { label: "Orders", key: "orders" as const, icon: ShoppingCart, change: "From checkout" },
  { label: "Customers", key: "customers" as const, icon: Users, change: "From orders" },
];

export default function AdminDashboard() {
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const totalValue = products.reduce((sum, p) => sum + (p.salePrice ?? p.price), 0);
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => setOrders([]));
  }, []);

  const customerCount = new Set(
    orders.map((order) => order.customer.email.toLowerCase())
  ).size;

  const statValues = {
    products: products.length.toString(),
    categories: categories.length.toString(),
    orders: orders.length.toString(),
    customers: customerCount.toString(),
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Dashboard</h1>
      <p className="text-charcoal/60 mb-8">Welcome to RukZa&apos;s Fashion Hub admin panel</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-sm border border-cream-dark">
            <stat.icon size={20} className="text-burgundy mb-3" />
            <p className="text-2xl font-bold text-charcoal">{statValues[stat.key]}</p>
            <p className="text-sm text-charcoal/60 mt-1">{stat.label}</p>
            <p className="text-xs text-charcoal/40 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-sm border border-cream-dark">
          <h2 className="font-semibold text-lg mb-4">Recent Products</h2>
          <div className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-cream-dark/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-charcoal/50">{p.categoryName}</p>
                </div>
                <Price amount={p.salePrice ?? p.price} className="text-sm font-medium" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-cream-dark">
          <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/admin/products" className="p-4 border border-cream-dark rounded-sm hover:border-burgundy transition-colors text-center">
              <Package size={24} className="mx-auto text-burgundy mb-2" />
              <p className="text-sm font-medium">Edit Products</p>
            </a>
            <a href="/admin/panels" className="p-4 border border-cream-dark rounded-sm hover:border-burgundy transition-colors text-center">
              <TrendingUp size={24} className="mx-auto text-burgundy mb-2" />
              <p className="text-sm font-medium">Home Panels</p>
            </a>
            <a href="/admin/settings" className="p-4 border border-cream-dark rounded-sm hover:border-burgundy transition-colors text-center">
              <TrendingUp size={24} className="mx-auto text-burgundy mb-2" />
              <p className="text-sm font-medium">Currency & Settings</p>
            </a>
            <a href="/admin/banners" className="p-4 border border-cream-dark rounded-sm hover:border-burgundy transition-colors text-center">
              <ShoppingCart size={24} className="mx-auto text-burgundy mb-2" />
              <p className="text-sm font-medium">Edit Banners</p>
            </a>
            <a href="/admin/categories" className="p-4 border border-cream-dark rounded-sm hover:border-burgundy transition-colors text-center">
              <Users size={24} className="mx-auto text-burgundy mb-2" />
              <p className="text-sm font-medium">Categories</p>
            </a>
          </div>

          <div className="mt-6 p-4 bg-burgundy/5 rounded-sm">
            <p className="text-sm font-medium text-burgundy">Catalog Value</p>
            <Price amount={totalValue} className="text-2xl font-bold text-charcoal mt-1" />
            <p className="text-xs text-charcoal/50 mt-1">Total value of all products</p>
          </div>
        </div>
      </div>
    </div>
  );
}
