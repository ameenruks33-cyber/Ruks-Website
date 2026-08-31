"use client";

import Link from "next/link";
import { Share2, Camera, Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useSettingsStore } from "@/store/settings-store";

export function Footer() {
  const {
    storeName,
    tagline,
    email,
    phone,
    address,
    facebookUrl,
    instagramUrl,
  } = useSettingsStore();

  return (
    <footer className="bg-charcoal text-cream/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div>
            <h3 className="font-display text-2xl font-bold text-cream mb-2">{storeName}</h3>
            <p className="text-sm text-cream/60 mb-6 italic">{tagline}</p>
            <div className="flex gap-4">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream/10 hover:bg-burgundy transition-colors"
                aria-label="Facebook"
              >
                <Share2 size={18} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream/10 hover:bg-burgundy transition-colors"
                aria-label="Instagram"
              >
                <Camera size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-cream font-semibold mb-4 tracking-wide">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-cream font-semibold mb-4 tracking-wide">Grow With Us</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/sell" className="hover:text-gold transition-colors">Sell on RukZa</Link></li>
              <li><Link href="/refer" className="hover:text-gold transition-colors">Refer &amp; Earn</Link></li>
              <li><Link href="/account/orders" className="hover:text-gold transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-cream font-semibold mb-4 tracking-wide">Customer Service</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/account/orders" className="hover:text-gold transition-colors">Track Order</Link></li>
              <li><Link href="/shipping" className="hover:text-gold transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-gold transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-cream font-semibold mb-4 tracking-wide">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-gold transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-cream/40">
          <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-cream/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cream/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
