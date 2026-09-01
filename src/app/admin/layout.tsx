"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminSyncStatus } from "@/components/admin/AdminSyncStatus";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Image as ImageIcon,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Tag, label: "Categories", href: "/admin/categories" },
  { icon: Tag, label: "Coupons", href: "/admin/coupons" },
  { icon: ImageIcon, label: "Banners", href: "/admin/banners" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Login page — no sidebar, no admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-cream-dark/30">
      <aside className="w-64 bg-charcoal text-cream flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-cream/10">
          <Link href="/admin" className="font-display text-xl font-bold text-cream">
            RukZa Admin
          </Link>
          <p className="text-xs text-cream/40 mt-1">Private — Owner Only</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-cream/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-cream/50 hover:text-cream transition-colors"
          >
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-cream/50 hover:text-red-300 transition-colors w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-cream-dark px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="font-display text-lg font-bold text-burgundy lg:hidden">
            RukZa Admin
          </Link>
          <p className="hidden lg:block text-xs text-charcoal/40">
            Confidential admin area — not visible to customers
          </p>
          <AdminSyncStatus />
          <button
            onClick={handleLogout}
            className="text-sm text-charcoal/60 hover:text-burgundy flex items-center gap-1.5"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
