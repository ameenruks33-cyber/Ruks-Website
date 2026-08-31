"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Save, Tag } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { useSettingsStore } from "@/store/settings-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import type { Coupon } from "@/types";

const EMPTY_COUPON: Coupon = {
  code: "",
  discountType: "percentage",
  discountValue: 10,
  minOrder: 0,
  isActive: true,
};

export default function AdminCouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCatalogStore();
  const formatPrice = useSettingsStore((s) => s.formatPrice);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Coupon>(EMPTY_COUPON);
  const [saved, setSaved] = useState(false);

  const startEdit = (coupon: Coupon) => {
    setForm({ ...coupon, isActive: coupon.isActive ?? true });
    setEditing(coupon.code);
    setShowAdd(false);
  };

  const startAdd = () => {
    setForm(EMPTY_COUPON);
    setEditing(null);
    setShowAdd(true);
  };

  const handleSave = () => {
    if (!form.code.trim()) return;
    const coupon = {
      ...form,
      code: form.code.toUpperCase(),
      minOrder: form.minOrder || undefined,
    };
    if (editing) {
      updateCoupon(editing, coupon);
    } else {
      addCoupon(coupon);
    }
    setSaved(true);
    setEditing(null);
    setShowAdd(false);
    setForm(EMPTY_COUPON);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (code: string) => {
    if (confirm(`Delete coupon ${code}?`)) deleteCoupon(code);
  };

  const toggleActive = (code: string, isActive: boolean) => {
    updateCoupon(code, { isActive });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Coupons</h1>
          <p className="text-charcoal/60">
            {coupons.length} coupon{coupons.length !== 1 ? "s" : ""} — customers use these at checkout
          </p>
        </div>
        <Button onClick={startAdd}>
          <Plus size={18} />
          Add Coupon
        </Button>
      </div>

      {(showAdd || editing) && (
        <div className="bg-white border border-cream-dark rounded-sm p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-lg">
            {editing ? `Edit ${editing}` : "New Coupon"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Coupon Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="SUMMER25"
              disabled={!!editing}
            />
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Discount Type</label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm({ ...form, discountType: e.target.value as "percentage" | "fixed" })
                }
                className="w-full px-4 py-3 border border-cream-dark rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <Input
              label={form.discountType === "percentage" ? "Discount %" : "Discount Amount"}
              type="number"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
            />
            <Input
              label="Minimum Order (optional)"
              type="number"
              value={form.minOrder ?? ""}
              onChange={(e) =>
                setForm({ ...form, minOrder: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive !== false}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="accent-burgundy"
            />
            Active (customers can use this code)
          </label>
          <div className="flex gap-3">
            <Button onClick={handleSave}>
              <Save size={16} />
              {saved ? "Saved!" : "Save Coupon"}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowAdd(false); setEditing(null); }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className={`bg-white border rounded-sm p-5 ${
              coupon.isActive === false ? "border-cream-dark opacity-60" : "border-cream-dark"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-burgundy" />
                <span className="font-bold text-lg text-charcoal tracking-wide">{coupon.code}</span>
              </div>
              <Badge variant={coupon.isActive === false ? "default" : "sale"}>
                {coupon.isActive === false ? "Inactive" : "Active"}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-burgundy mb-1">
              {coupon.discountType === "percentage"
                ? `${coupon.discountValue}% OFF`
                : `${formatPrice(coupon.discountValue)} OFF`}
            </p>
            {coupon.minOrder && (
              <p className="text-xs text-charcoal/50 mb-4">
                Min. order: {formatPrice(coupon.minOrder)}
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => startEdit(coupon)}>
                <Pencil size={14} />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleActive(coupon.code, coupon.isActive === false)}
              >
                {coupon.isActive === false ? "Activate" : "Deactivate"}
              </Button>
              <button
                onClick={() => handleDelete(coupon.code)}
                className="p-2 text-charcoal/40 hover:text-red-500 transition-colors"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && !showAdd && (
        <div className="bg-white border border-cream-dark rounded-sm p-12 text-center mt-4">
          <Tag size={48} className="mx-auto text-charcoal/20 mb-4" />
          <p className="text-charcoal/60">No coupons yet. Click &quot;Add Coupon&quot; to create one.</p>
        </div>
      )}
    </div>
  );
}
