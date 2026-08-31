import Link from "next/link";
import { User, Package, Heart, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";

const MENU_ITEMS = [
  { icon: Package, label: "My Orders", href: "/account/orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: Settings, label: "Account Settings", href: "/account/settings" },
];

export default function AccountPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-burgundy" />
        </div>
        <h1 className="font-display text-3xl font-bold text-charcoal mb-2">My Account</h1>
        <p className="text-charcoal/60">Sign in to manage your orders and preferences</p>
      </div>

      <div className="bg-white p-8 rounded-sm border border-cream-dark mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/account/login">
            <Button className="w-full" size="lg">Sign In</Button>
          </Link>
          <Link href="/account/register">
            <Button variant="outline" className="w-full" size="lg">Create Account</Button>
          </Link>
        </div>
        <p className="text-center text-sm text-charcoal/50 mt-4">
          Or continue as a guest during checkout
        </p>
      </div>

      <div className="space-y-2">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 p-4 bg-white rounded-sm border border-cream-dark hover:border-burgundy/30 transition-colors"
          >
            <item.icon size={20} className="text-burgundy" />
            <span className="font-medium text-charcoal">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
