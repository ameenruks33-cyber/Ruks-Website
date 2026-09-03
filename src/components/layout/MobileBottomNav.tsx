"use client";

import Link from "next/link";
import { Home, Grid3X3, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Categories", icon: Grid3X3 },
  { href: "/shop", label: "Search", icon: Search, action: "search" as const },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/account", label: "Account", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-dark safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href) && item.label !== "Search";
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-[10px] font-medium transition-colors relative",
                isActive ? "text-burgundy" : "text-charcoal/60"
              )}
            >
              <Icon size={20} />
              {item.label === "Cart" && itemCount > 0 && (
                <span className="absolute top-1 right-1/4 bg-burgundy text-cream text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
