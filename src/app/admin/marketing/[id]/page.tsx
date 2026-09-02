"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMarketingStore } from "@/store/marketing-store";
import { MarketingPostEditor } from "@/components/admin/MarketingPostEditor";
import type { MarketingPost } from "@/types/marketing";

export default function MarketingEditPage() {
  const params = useParams<{ id: string }>();
  const postId = params?.id ?? "";
  const router = useRouter();
  const getPostById = useMarketingStore((s) => s.getPostById);
  const marketingPosts = useMarketingStore((s) => s.marketingPosts);
  const [post, setPost] = useState<MarketingPost | null>(null);

  useEffect(() => {
    const found = marketingPosts.find((p) => p.id === postId) ?? getPostById(postId) ?? null;
    setPost(found);
  }, [postId, marketingPosts, getPostById]);

  if (!postId) {
    return <div className="p-8 text-charcoal/70">Invalid post link.</div>;
  }

  if (!post) {
    return (
      <div className="p-8 text-center">
        <p className="text-charcoal/70 mb-4">Marketing post not found.</p>
        <Link href="/admin/marketing" className="text-burgundy hover:underline">
          Back to AI Marketing
        </Link>
      </div>
    );
  }

  return (
    <MarketingPostEditor
      post={post}
      onClose={() => router.push("/admin/marketing")}
    />
  );
}
