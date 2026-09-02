"use client";

import { useState } from "react";
import { Save, RotateCcw, Zap, Mail, Megaphone } from "lucide-react";
import { useHomePanelsStore } from "@/store/home-panels-store";
import { syncCatalogNow } from "@/lib/catalog-sync";
import {
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
  type HomePanelsConfig,
} from "@/lib/home-panels";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function PanelToggle({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? "bg-burgundy" : "bg-cream-dark"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-sm font-medium text-charcoal">
        {enabled ? "Enabled — visible on website" : "Disabled — hidden from website"}
      </span>
    </label>
  );
}

function PanelSection({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white p-6 rounded-sm border border-cream-dark">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2.5 bg-burgundy/10 rounded-sm">
          <Icon size={22} className="text-burgundy" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-lg text-charcoal">{title}</h2>
          <p className="text-sm text-charcoal/60 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="mb-6 pb-6 border-b border-cream-dark">
        <PanelToggle enabled={enabled} onChange={onToggle} label={`Toggle ${title}`} />
      </div>
      <div className={`space-y-4 ${!enabled ? "opacity-50 pointer-events-none" : ""}`}>
        {children}
      </div>
    </section>
  );
}

export default function AdminPanelsPage() {
  const store = useHomePanelsStore();
  const [form, setForm] = useState<HomePanelsConfig>({
    dealsBar: { ...store.dealsBar },
    promoBanner: { ...store.promoBanner },
    newsletter: { ...store.newsletter },
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    store.setHomePanels(form);
    await syncCatalogNow();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (!confirm("Reset all homepage panels to defaults?")) return;
    store.resetHomePanels();
    const next = useHomePanelsStore.getState();
    setForm({
      dealsBar: { ...next.dealsBar },
      promoBanner: { ...next.promoBanner },
      newsletter: { ...next.newsletter },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Homepage Panels</h1>
          <p className="text-charcoal/60">
            Enable, disable, and edit the deals bar, promo banner, and newsletter section
          </p>
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

      <div className="space-y-6">
        <PanelSection
          icon={Zap}
          title="Deals Bar"
          description="Top countdown strip — Today's Deals with timer and shop button"
          enabled={form.dealsBar.enabled}
          onToggle={(enabled) =>
            setForm((prev) => ({ ...prev, dealsBar: { ...prev.dealsBar, enabled } }))
          }
        >
          <Input
            label="Title"
            value={form.dealsBar.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                dealsBar: { ...prev.dealsBar, title: e.target.value },
              }))
            }
          />
          <Input
            label="Subtitle"
            value={form.dealsBar.subtitle}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                dealsBar: { ...prev.dealsBar, subtitle: e.target.value },
              }))
            }
          />
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Countdown ends at
            </label>
            <input
              type="datetime-local"
              value={toDatetimeLocalValue(form.dealsBar.countdownEndsAt)}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  dealsBar: {
                    ...prev.dealsBar,
                    countdownEndsAt: fromDatetimeLocalValue(e.target.value),
                  },
                }))
              }
              className="w-full px-4 py-3 border border-cream-dark rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Button text"
              value={form.dealsBar.buttonText}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  dealsBar: { ...prev.dealsBar, buttonText: e.target.value },
                }))
              }
            />
            <Input
              label="Button link"
              value={form.dealsBar.buttonLink}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  dealsBar: { ...prev.dealsBar, buttonLink: e.target.value },
                }))
              }
            />
          </div>
        </PanelSection>

        <PanelSection
          icon={Megaphone}
          title="Promo Banner"
          description="Large sale section in the middle of the homepage"
          enabled={form.promoBanner.enabled}
          onToggle={(enabled) =>
            setForm((prev) => ({ ...prev, promoBanner: { ...prev.promoBanner, enabled } }))
          }
        >
          <Input
            label="Small label (e.g. Limited Time)"
            value={form.promoBanner.label}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                promoBanner: { ...prev.promoBanner, label: e.target.value },
              }))
            }
          />
          <Input
            label="Headline"
            value={form.promoBanner.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                promoBanner: { ...prev.promoBanner, title: e.target.value },
              }))
            }
          />
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
            <textarea
              value={form.promoBanner.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  promoBanner: { ...prev.promoBanner, description: e.target.value },
                }))
              }
              rows={3}
              className="w-full px-4 py-3 border border-cream-dark rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Button text"
              value={form.promoBanner.buttonText}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  promoBanner: { ...prev.promoBanner, buttonText: e.target.value },
                }))
              }
            />
            <Input
              label="Button link"
              value={form.promoBanner.buttonLink}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  promoBanner: { ...prev.promoBanner, buttonLink: e.target.value },
                }))
              }
            />
          </div>
        </PanelSection>

        <PanelSection
          icon={Mail}
          title="Newsletter Signup"
          description="Email subscription section at the bottom of the homepage"
          enabled={form.newsletter.enabled}
          onToggle={(enabled) =>
            setForm((prev) => ({ ...prev, newsletter: { ...prev.newsletter, enabled } }))
          }
        >
          <Input
            label="Title"
            value={form.newsletter.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                newsletter: { ...prev.newsletter, title: e.target.value },
              }))
            }
          />
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
            <textarea
              value={form.newsletter.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  newsletter: { ...prev.newsletter, description: e.target.value },
                }))
              }
              rows={2}
              className="w-full px-4 py-3 border border-cream-dark rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email placeholder"
              value={form.newsletter.emailPlaceholder}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  newsletter: { ...prev.newsletter, emailPlaceholder: e.target.value },
                }))
              }
            />
            <Input
              label="Button text"
              value={form.newsletter.buttonText}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  newsletter: { ...prev.newsletter, buttonText: e.target.value },
                }))
              }
            />
          </div>
          <Input
            label="Success message (after subscribe)"
            value={form.newsletter.successMessage}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                newsletter: { ...prev.newsletter, successMessage: e.target.value },
              }))
            }
          />
        </PanelSection>
      </div>
    </div>
  );
}
