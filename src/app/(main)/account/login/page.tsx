"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth integration placeholder
    alert("Authentication will be connected with secure login in production.");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-charcoal mb-2 text-center">Sign In</h1>
      <p className="text-charcoal/60 text-center mb-8">Welcome back to RukZa&apos;s Fashion Hub</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm border border-cream-dark space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" size="lg">Sign In</Button>
      </form>

      <p className="text-center text-sm text-charcoal/60 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/account/register" className="text-burgundy hover:underline font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
