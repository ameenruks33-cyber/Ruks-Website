"use client";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 max-w-lg">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-2">
        AI Marketing hit a problem
      </h1>
      <p className="text-charcoal/70 mb-4 text-sm">
        {error.message || "Something went wrong loading this page."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 bg-burgundy text-cream rounded-sm text-sm"
      >
        Try again
      </button>
    </div>
  );
}
