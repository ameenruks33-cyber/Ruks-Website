"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  Store,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useSettingsStore } from "@/store/settings-store";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

const TRENDING = ["Abaya", "Hijab", "Kurta", "Kids wear", "Party dress"];

export function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const storeName = useSettingsStore((s) => s.storeName);
  const tagline = useSettingsStore((s) => s.tagline);
  const topBarMessage = useSettingsStore((s) => s.topBarMessage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-cream-dark">
      <div className="bg-charcoal text-cream text-center text-xs py-2 tracking-wide px-4">
        {topBarMessage}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main row */}
        <div className="flex items-center gap-4 h-16 lg:h-[72px]">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -ml-2 text-charcoal"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex-shrink-0">
            <h1 className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-burgundy tracking-tight leading-tight">
              {storeName}
            </h1>
            <p className="hidden sm:block text-[9px] text-charcoal/50 tracking-[0.2em] uppercase">
              {tagline}
            </p>
          </Link>

          {/* Amazon-style search — desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-auto">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full pl-10 pr-4 py-2.5 border border-cream-dark rounded-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-3 ml-auto">
            <Link
              href="/sell"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-burgundy hover:bg-burgundy/5 rounded-sm transition-colors"
            >
              <Store size={16} />
              Sell
            </Link>
            <Link href="/account" className="hidden sm:flex flex-col items-center p-2 text-charcoal hover:text-burgundy text-xs">
              <User size={20} />
              <span className="hidden lg:block mt-0.5">Account</span>
            </Link>
            <Link href="/wishlist" className="relative hidden sm:flex flex-col items-center p-2 text-charcoal hover:text-burgundy text-xs">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-burgundy text-cream text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              <span className="hidden lg:block mt-0.5">Wishlist</span>
            </Link>
            <Link href="/cart" className="relative flex flex-col items-center p-2 text-charcoal hover:text-burgundy text-xs">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-burgundy text-cream text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
              <span className="hidden lg:block mt-0.5">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-cream-dark rounded-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            />
          </div>
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            {TRENDING.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => router.push(`/shop?q=${encodeURIComponent(term)}`)}
                className="text-xs bg-cream-dark px-3 py-1 rounded-full whitespace-nowrap text-charcoal/70 hover:text-burgundy"
              >
                {term}
              </button>
            ))}
          </div>
        </form>

        {/* Desktop category nav */}
        <nav className="hidden lg:flex items-center gap-6 pb-2 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-charcoal/70 hover:text-burgundy font-medium whitespace-nowrap">
              {link.label}
            </Link>
          ))}
          <Link href="/refer" className="text-gold hover:text-gold-light font-semibold whitespace-nowrap">
            Refer &amp; Earn
          </Link>
          <Link href="/account/orders" className="text-charcoal/70 hover:text-burgundy whitespace-nowrap">
            Track Order
          </Link>
        </nav>
      </div>

      {/* Mobile nav drawer */}
      <div className={cn("lg:hidden overflow-hidden transition-all duration-300", mobileOpen ? "max-h-[28rem] border-t border-cream-dark" : "max-h-0")}>
        <nav className="px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-2.5 text-charcoal hover:text-burgundy font-medium border-b border-cream-dark/50">
              {link.label}
            </Link>
          ))}
          <Link href="/sell" onClick={() => setMobileOpen(false)} className="block py-2.5 text-burgundy font-semibold">Sell on RukZa</Link>
          <Link href="/refer" onClick={() => setMobileOpen(false)} className="block py-2.5 text-gold font-semibold">Refer &amp; Earn</Link>
          <Link href="/account/orders" onClick={() => setMobileOpen(false)} className="block py-2.5 text-charcoal hover:text-burgundy">Track Order</Link>
          <Link href="/account" onClick={() => setMobileOpen(false)} className="block py-2.5 text-charcoal hover:text-burgundy">My Account</Link>
        </nav>
      </div>
    </header>
  );
}
