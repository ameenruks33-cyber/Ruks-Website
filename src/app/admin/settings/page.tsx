"use client";

import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { useSettingsStore } from "@/store/settings-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import { CURRENCIES } from "@/lib/settings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminSettingsPage() {
  const settings = useSettingsStore();
  const [form, setForm] = useState({
    storeName: settings.storeName,
    tagline: settings.tagline,
    description: settings.description,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    district: settings.district,
    gstin: settings.gstin,
    currency: settings.currency,
    freeShippingThreshold: settings.freeShippingThreshold,
    standardShippingPrice: settings.standardShippingPrice,
    expressShippingPrice: settings.expressShippingPrice,
    facebookUrl: settings.facebookUrl,
    instagramUrl: settings.instagramUrl,
    whatsappUrl: settings.whatsappUrl,
    topBarMessage: settings.topBarMessage,
    googleMapsEmbedUrl: settings.googleMapsEmbedUrl,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    settings.updateSettings(form);
    await syncCatalogNow();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Reset all settings to defaults?")) {
      settings.resetSettings();
      const s = useSettingsStore.getState();
      setForm({
        storeName: s.storeName,
        tagline: s.tagline,
        description: s.description,
        email: s.email,
        phone: s.phone,
        address: s.address,
        district: s.district,
        gstin: s.gstin,
        currency: s.currency,
        freeShippingThreshold: s.freeShippingThreshold,
        standardShippingPrice: s.standardShippingPrice,
        expressShippingPrice: s.expressShippingPrice,
        facebookUrl: s.facebookUrl,
        instagramUrl: s.instagramUrl,
        whatsappUrl: s.whatsappUrl,
        topBarMessage: s.topBarMessage,
        googleMapsEmbedUrl: s.googleMapsEmbedUrl,
      });
    }
  };

  const update = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Settings</h1>
          <p className="text-charcoal/60">Shop name, phone, address, delivery charges — everything customers see</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw size={16} />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save size={16} />
            {saved ? "Published!" : "Save & Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-sm border border-cream-dark">
          <h2 className="font-semibold text-lg mb-6">Shop identity</h2>
          <div className="space-y-4">
            <Input label="Shop name" value={form.storeName} onChange={(e) => update("storeName", e.target.value)} />
            <Input label="Tagline" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-cream-dark rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30"
              />
            </div>
            <Input label="Top bar message" value={form.topBarMessage} onChange={(e) => update("topBarMessage", e.target.value)} />
            <Input label="GSTIN (for invoices)" value={form.gstin} onChange={(e) => update("gstin", e.target.value)} />
          </div>
        </section>

        <section className="bg-white p-6 rounded-sm border border-cream-dark">
          <h2 className="font-semibold text-lg mb-6">Currency &amp; delivery</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => update("currency", e.target.value)}
                className="w-full px-4 py-3 border border-cream-dark rounded-sm bg-white"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>
            <Input label="Free delivery above (₹)" type="number" value={form.freeShippingThreshold} onChange={(e) => update("freeShippingThreshold", Number(e.target.value))} />
            <Input label="Standard delivery charge (₹)" type="number" value={form.standardShippingPrice} onChange={(e) => update("standardShippingPrice", Number(e.target.value))} />
            <Input label="Express delivery charge (₹)" type="number" value={form.expressShippingPrice} onChange={(e) => update("expressShippingPrice", Number(e.target.value))} />
          </div>
        </section>

        <section className="bg-white p-6 rounded-sm border border-cream-dark">
          <h2 className="font-semibold text-lg mb-6">Contact &amp; location</h2>
          <div className="space-y-4">
            <Input label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            <Input label="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            <Input label="Full address" value={form.address} onChange={(e) => update("address", e.target.value)} />
            <Input label="District" value={form.district} onChange={(e) => update("district", e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Google Maps embed URL</label>
              <textarea
                value={form.googleMapsEmbedUrl}
                onChange={(e) => update("googleMapsEmbedUrl", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-cream-dark rounded-sm text-xs"
                placeholder="Paste from Google Maps → Share → Embed a map"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-sm border border-cream-dark">
          <h2 className="font-semibold text-lg mb-6">Social &amp; WhatsApp</h2>
          <div className="space-y-4">
            <Input label="WhatsApp link" value={form.whatsappUrl} onChange={(e) => update("whatsappUrl", e.target.value)} placeholder="https://wa.me/919876543210" />
            <Input label="Facebook" value={form.facebookUrl} onChange={(e) => update("facebookUrl", e.target.value)} />
            <Input label="Instagram" value={form.instagramUrl} onChange={(e) => update("instagramUrl", e.target.value)} />
          </div>
        </section>
      </div>
    </div>
  );
}
