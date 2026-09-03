"use client";

import { MapPin, Phone, Mail, MessageCircle, Navigation } from "lucide-react";
import { useSettingsStore } from "@/store/settings-store";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function LocationPage() {
  const {
    storeName,
    address,
    phone,
    email,
    whatsappUrl,
    googleMapsEmbedUrl,
    storeLatitude,
    storeLongitude,
  } = useSettingsStore();

  const phoneTel = phone.replace(/\s/g, "");
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${storeLatitude},${storeLongitude}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold mb-4">Visit Our Store</h1>
        <p className="text-charcoal/70">Come see our full range of appliances and spare parts in person.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-cream-dark rounded-sm p-8 space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-burgundy mb-2">{storeName}</h2>
            <p className="text-charcoal/70">Registered Kerala appliance &amp; spare parts shop</p>
          </div>

          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-burgundy flex-shrink-0 mt-0.5" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-burgundy flex-shrink-0" />
              <a href={`tel:${phoneTel}`} className="hover:text-burgundy transition-colors">{phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle size={20} className="text-burgundy flex-shrink-0" />
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-burgundy transition-colors">
                WhatsApp Us
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-burgundy flex-shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-burgundy transition-colors">{email}</a>
            </li>
          </ul>

          <div className="flex flex-wrap gap-3 pt-4">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <Button>
                <Navigation size={16} />
                Get Directions
              </Button>
            </a>
            <a href={`tel:${phoneTel}`}>
              <Button variant="outline">
                <Phone size={16} />
                Call Store
              </Button>
            </a>
          </div>

          <div className="pt-4 border-t border-cream-dark text-sm text-charcoal/60">
            <p><strong>Store Hours:</strong> Mon–Sat 9:00 AM – 8:00 PM</p>
            <p className="mt-1"><strong>Sunday:</strong> 10:00 AM – 6:00 PM</p>
            <p className="mt-3">Free store pickup available for online orders.</p>
          </div>
        </div>

        <div className="rounded-sm overflow-hidden border border-cream-dark h-80 lg:h-auto min-h-[320px]">
          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 320 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${storeName} location`}
          />
        </div>
      </div>

      <div className="text-center mt-10">
        <Link href="/shop" className="text-burgundy hover:underline text-sm font-medium">
          Browse products online →
        </Link>
      </div>
    </div>
  );
}
