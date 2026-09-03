"use client";

import Link from "next/link";
import { Share2, Camera, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useSettingsStore } from "@/store/settings-store";

export function Footer() {
  const {
    storeName,
    tagline,
    email,
    phone,
    address,
    whatsappUrl,
    facebookUrl,
    instagramUrl,
    googleMapsEmbedUrl,
  } = useSettingsStore();

  const phoneTel = phone.replace(/\s/g, "");

  return (
    <footer className="bg-ink text-charcoal/80 mt-auto border-t border-burgundy/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div>
            <h3 className="font-display text-2xl font-bold text-charcoal mb-2">
              {/^nexcart\s*x$/i.test(storeName.trim()) ? (
                <>
                  NexCart
                  <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-sm bg-burgundy text-ink text-[0.72em] font-extrabold align-middle">
                    X
                  </span>
                </>
              ) : (
                <span className="text-burgundy">{storeName}</span>
              )}
            </h3>
            <p className="text-sm text-charcoal/60 mb-6 italic">{tagline}</p>
            <div className="flex gap-4">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream-dark hover:bg-burgundy hover:text-ink transition-colors"
                aria-label="Facebook"
              >
                <Share2 size={18} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream-dark hover:bg-burgundy hover:text-ink transition-colors"
                aria-label="Instagram"
              >
                <Camera size={18} />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream-dark hover:bg-burgundy hover:text-ink transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-burgundy font-semibold mb-4 tracking-wide">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/shop" className="hover:text-burgundy transition-colors">All Products</Link></li>
              {NAV_LINKS.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-burgundy transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li><Link href="/location" className="hover:text-burgundy transition-colors">Store Location</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-burgundy font-semibold mb-4 tracking-wide">Customer Service</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/account/orders" className="hover:text-burgundy transition-colors">Track Order</Link></li>
              <li><Link href="/shipping" className="hover:text-burgundy transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-burgundy transition-colors">Return &amp; Refund Policy</Link></li>
              <li><Link href="/warranty" className="hover:text-burgundy transition-colors">Warranty</Link></li>
              <li><Link href="/faq" className="hover:text-burgundy transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-burgundy transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-burgundy font-semibold mb-4 tracking-wide">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/terms" className="hover:text-burgundy transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-burgundy transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-burgundy font-semibold mb-4 tracking-wide">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-burgundy" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0 text-burgundy" />
                <a href={`tel:${phoneTel}`} className="hover:text-burgundy transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={16} className="flex-shrink-0 text-burgundy" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-burgundy transition-colors">
                  WhatsApp Support
                </a>
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

        {googleMapsEmbedUrl && (
          <div className="mt-12 rounded-sm overflow-hidden border border-cream/10 h-48">
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store location map"
            />
          </div>
        )}

        <div className="border-t border-burgundy/15 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-charcoal/40">
          <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved. Kerala, India.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-burgundy transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-burgundy transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
