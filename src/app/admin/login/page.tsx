"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Wrong password. Only the store owner can access this area.");
        setLoading(false);
        return;
      }

      const redirect = searchParams.get("from") || "/admin";
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-burgundy/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-burgundy" />
          </div>
          <h1 className="font-display text-2xl font-bold text-cream mb-2">
            Private Admin Access
          </h1>
          <p className="text-cream/50 text-sm">
            This area is confidential — for store owner only
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-sm p-8 shadow-xl space-y-5"
        >
          <div className="flex items-center gap-2 text-charcoal/60 text-sm mb-2">
            <Lock size={16} />
            <span>Enter your admin password to continue</span>
          </div>

          <Input
            label="Admin Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your private password"
            required
            autoFocus
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-sm">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Verifying..." : "Unlock Admin Panel"}
          </Button>
        </form>

        <p className="text-center text-cream/30 text-xs mt-6">
          Customers cannot access this page. Not linked from the public store.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-charcoal" />}>
      <LoginForm />
    </Suspense>
  );
}
