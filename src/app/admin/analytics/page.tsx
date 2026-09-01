"use client";

import {
  BarChart3,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
  Users,
} from "lucide-react";
import { useOrdersStore } from "@/store/orders-store";
import { useCatalogStore } from "@/store/catalog-store";
import { useCustomersStore } from "@/store/customers-store";
import { Price } from "@/components/ui/Price";

export default function AdminAnalyticsPage() {
  const orders = useOrdersStore((s) => s.orders);
  const products = useCatalogStore((s) => s.products);
  const customers = useCustomersStore((s) => s.customers);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totals.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const activeProducts = products.filter((p) => p.isActive).length;

  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Top products by quantity sold
  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSales[item.name]) {
        productSales[item.name] = { name: item.name, qty: 0, revenue: 0 };
      }
      productSales[item.name].qty += item.quantity;
      productSales[item.name].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const stats = [
    {
      label: "Total Revenue",
      value: totalRevenue,
      icon: DollarSign,
      format: "price" as const,
      change: `${totalOrders} orders`,
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      format: "number" as const,
      change: totalOrders === 0 ? "No orders yet" : "All time",
    },
    {
      label: "Avg. Order Value",
      value: avgOrderValue,
      icon: TrendingUp,
      format: "price" as const,
      change: "Per order",
    },
    {
      label: "Customers",
      value: customers.length,
      icon: Users,
      format: "number" as const,
      change: `${activeProducts} active products`,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-charcoal">Analytics</h1>
        <p className="text-charcoal/60">Sales overview and store performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-sm border border-cream-dark">
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className="text-burgundy" />
            </div>
            <p className="text-2xl font-bold text-charcoal">
              {stat.format === "price" ? (
                <Price amount={stat.value as number} />
              ) : (
                stat.value
              )}
            </p>
            <p className="text-sm text-charcoal/60 mt-1">{stat.label}</p>
            <p className="text-xs text-charcoal/40 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order status breakdown */}
        <div className="bg-white p-6 rounded-sm border border-cream-dark">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-burgundy" />
            Orders by Status
          </h2>
          {totalOrders === 0 ? (
            <p className="text-charcoal/50 text-sm">No orders yet. Data appears when customers checkout.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-charcoal">{status.toLowerCase()}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-burgundy rounded-full"
                      style={{ width: `${(count / totalOrders) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white p-6 rounded-sm border border-cream-dark">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Package size={18} className="text-burgundy" />
            Top Selling Products
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-charcoal/50 text-sm">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between py-2 border-b border-cream-dark/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-burgundy/10 text-burgundy text-xs font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                      <p className="text-xs text-charcoal/50">{product.qty} sold</p>
                    </div>
                  </div>
                  <Price amount={product.revenue} className="text-sm font-medium" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-white p-6 rounded-sm border border-cream-dark lg:col-span-2">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <ShoppingCart size={18} className="text-burgundy" />
            Recent Orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-charcoal/50 text-sm">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-charcoal/50 border-b border-cream-dark">
                    <th className="pb-3 font-medium">Order #</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.orderNumber} className="border-b border-cream-dark/50">
                      <td className="py-3 font-medium text-burgundy">{order.orderNumber}</td>
                      <td className="py-3 text-charcoal/70">{order.customer?.email || "Guest"}</td>
                      <td className="py-3">
                        <span className="text-xs bg-burgundy/10 text-burgundy px-2 py-1 rounded-sm capitalize">
                          {order.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="py-3 text-charcoal/60">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right font-medium">
                        <Price amount={order.totals.total} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
