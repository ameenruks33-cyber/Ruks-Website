"use client";

import { useEffect, useState } from "react";
import type { RepairRequest } from "@/types";

export default function AdminRepairPage() {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/repair", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { requests: [] }))
      .then((data) => setRequests(data.requests ?? []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Repair Requests</h1>
      <p className="text-charcoal/60 mb-8">Customer service bookings from the website</p>

      {loading ? (
        <p className="text-charcoal/50">Loading...</p>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-cream-dark rounded-sm p-8 text-center text-charcoal/50">
          No repair requests yet. They appear here when customers book at /repair
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-cream-dark overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-dark/30">
              <tr>
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Problem</th>
                <th className="text-left p-4">Schedule</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-cream-dark/50">
                  <td className="p-4 font-mono text-xs">{r.id}</td>
                  <td className="p-4">
                    <p className="font-medium">{r.customerName}</p>
                    <p className="text-xs text-charcoal/50">{r.phone}</p>
                    <p className="text-xs text-charcoal/50">{r.district} — {r.pincode}</p>
                  </td>
                  <td className="p-4">{r.productType}</td>
                  <td className="p-4">{r.problem}</td>
                  <td className="p-4 text-xs">
                    {r.preferredDate} {r.preferredTime}
                  </td>
                  <td className="p-4 capitalize">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
