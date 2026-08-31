"use client";

import Link from "next/link";
import { useState } from "react";
import { useCustomersStore } from "@/store/customers-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const registerCustomer = useCustomersStore((s) => s.registerCustomer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    registerCustomer({ name: form.name, email: form.email });
    alert("Account created! You can now sign in.");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-charcoal mb-2 text-center">Create Account</h1>
      <p className="text-charcoal/60 text-center mb-8">Join RukZa&apos;s Fashion Hub</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm border border-cream-dark space-y-4">
        <Input
          label="Full Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          label="Confirm Password"
          type="password"
          required
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
        <Button type="submit" className="w-full" size="lg">Create Account</Button>
      </form>

      <p className="text-center text-sm text-charcoal/60 mt-6">
        Already have an account?{" "}
        <Link href="/account/login" className="text-burgundy hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
