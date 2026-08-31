import Link from "next/link";
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
  return (
    <div className="min-h-screen flex bg-cream-dark/30">
      <aside className="w-64 bg-charcoal text-cream flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-cream/10">
          <Link href="/admin" className="font-display text-xl font-bold text-cream">
            RukZa Admin
          </Link>
          <p className="text-xs text-cream/40 mt-1">Management Dashboard</p>
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

        <div className="p-4 border-t border-cream/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-cream/50 hover:text-cream transition-colors"
          >
            <LogOut size={18} />
            Back to Store
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-cream-dark px-6 py-4 flex items-center justify-between lg:hidden">
          <Link href="/admin" className="font-display text-lg font-bold text-burgundy">
            RukZa Admin
          </Link>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
