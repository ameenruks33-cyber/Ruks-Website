"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Link2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ImageFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImageField({ label = "Image", value, onChange, hint }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const previewSrc =
    value.startsWith("/") || value.startsWith("http") ? value : value ? value : null;

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-charcoal">{label}</p>}
      {hint && <p className="text-xs text-charcoal/50">{hint}</p>}

      {previewSrc && (
        <div className="relative h-36 w-full max-w-sm rounded-sm overflow-hidden bg-cream-dark border border-cream-dark">
          <Image src={previewSrc} alt="Preview" fill className="object-cover" unoptimized />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading..." : "Upload from computer"}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-charcoal/40">
        <Link2 size={12} />
        <span>Or paste image URL</span>
      </div>
      <Input
        label=""
        placeholder="https://... or /uploads/your-photo.jpg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface MultiImageFieldProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function MultiImageField({ images, onChange }: MultiImageFieldProps) {
  const updateAt = (index: number, url: string) => {
    const next = [...images];
    next[index] = url;
    onChange(next);
  };

  const add = () => onChange([...images, ""]);
  const remove = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    onChange(next.length ? next : [""]);
  };

  return (
    <div className="space-y-6">
      {images.map((url, i) => (
        <div key={i} className="p-4 border border-cream-dark rounded-sm relative">
          <ImageField
            label={i === 0 ? "Main photo" : `Photo ${i + 1}`}
            value={url}
            onChange={(v) => updateAt(i, v)}
            hint={i === 0 ? "This shows on the shop page and cart" : undefined}
          />
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add another photo
      </Button>
    </div>
  );
}
