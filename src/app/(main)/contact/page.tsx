"use client";

import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { useSettingsStore } from "@/store/settings-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const { storeName, phone, email, whatsappUrl, address } = useSettingsStore();
  const [sent, setSent] = useState(false);
  const phoneTel = phone.replace(/\s/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-charcoal/70">Questions about products or orders? We&apos;re here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-cream-dark rounded-sm p-6">
            <h2 className="font-semibold mb-4">{storeName}</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-burgundy mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-burgundy" />
                <a href={`tel:${phoneTel}`} className="hover:text-burgundy">{phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-burgundy" />
                <a href={`mailto:${email}`} className="hover:text-burgundy">{email}</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="text-burgundy" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-burgundy">
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <p className="text-sm text-charcoal/60">
            For fastest response, message us on WhatsApp with your product name or order number.
          </p>
          <Link href="/location" className="text-burgundy text-sm font-medium hover:underline">
            View store location &amp; directions →
          </Link>
        </div>

        <div className="bg-white border border-cream-dark rounded-sm p-6">
          {sent ? (
            <div className="text-center py-8">
              <p className="font-semibold mb-2">Message received!</p>
              <p className="text-sm text-charcoal/60">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Your Name" required />
              <Input label="Mobile / Email" required />
              <div>
                <label className="block text-sm font-medium mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  className="w-full border border-cream-dark rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                  placeholder="How can we help?"
                />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
