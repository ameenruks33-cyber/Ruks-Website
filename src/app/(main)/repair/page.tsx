"use client";

import { useState } from "react";
import { Wrench, CheckCircle, Upload } from "lucide-react";
import { REPAIR_PRODUCT_TYPES, REPAIR_PROBLEMS, KERALA_DISTRICTS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RepairPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    productType: REPAIR_PRODUCT_TYPES[0],
    problem: REPAIR_PROBLEMS[0],
    customerName: "",
    phone: "",
    address: "",
    pincode: "",
    district: KERALA_DISTRICTS[6],
    preferredDate: "",
    preferredTime: "",
    description: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/repair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setRequestId(data.request.id);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <CheckCircle size={64} className="text-green-600 mx-auto mb-6" />
        <h1 className="font-display text-3xl font-bold mb-4">Service Booked!</h1>
        <p className="text-charcoal/70 mb-2">Your repair request has been received.</p>
        <p className="text-sm text-charcoal/50 mb-8">Reference: <strong>{requestId}</strong></p>
        <p className="text-sm text-charcoal/60">
          Our technician will contact you on {form.phone} to confirm your appointment.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-burgundy/10 text-burgundy px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Wrench size={16} />
          Expert Repair Service
        </div>
        <h1 className="font-display text-4xl font-bold mb-4">Book a Repair</h1>
        <p className="text-charcoal/70 max-w-xl mx-auto">
          Gas stove repair, commercial burner service and regulator replacement across Kerala.
          Fill in the details below and we&apos;ll schedule a visit.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-cream-dark rounded-sm p-6 sm:p-8">
        <fieldset className="space-y-4">
          <legend className="font-semibold text-charcoal mb-2">Product &amp; Problem</legend>
          <div>
            <label className="block text-sm font-medium mb-1.5">Product Type</label>
            <select
              value={form.productType}
              onChange={(e) => update("productType", e.target.value)}
              className="w-full border border-cream-dark rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            >
              {REPAIR_PRODUCT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Problem</label>
            <select
              value={form.problem}
              onChange={(e) => update("problem", e.target.value)}
              className="w-full border border-cream-dark rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            >
              {REPAIR_PROBLEMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-semibold text-charcoal mb-2">Your Details</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={form.customerName}
              onChange={(e) => update("customerName", e.target.value)}
              required
            />
            <Input
              label="Mobile (+91)"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="9876543210"
              required
            />
          </div>
          <Input
            label="Address"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="PIN Code"
              value={form.pincode}
              onChange={(e) => update("pincode", e.target.value)}
              placeholder="682001"
              maxLength={6}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1.5">District</label>
              <select
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                className="w-full border border-cream-dark rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
              >
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-semibold text-charcoal mb-2">Preferred Schedule</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Preferred Date"
              type="date"
              value={form.preferredDate}
              onChange={(e) => update("preferredDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
            <Input
              label="Preferred Time"
              type="time"
              value={form.preferredTime}
              onChange={(e) => update("preferredTime", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Describe the issue</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              className="w-full border border-cream-dark rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
              placeholder="Tell us more about the problem..."
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-charcoal/50">
            <Upload size={16} />
            Photo upload coming soon — for now, send photos via WhatsApp after booking.
          </div>
        </fieldset>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Booking..." : "Book Service"}
        </Button>
      </form>
    </div>
  );
}
