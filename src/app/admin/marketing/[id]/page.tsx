"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const OPEN_EDIT_KEY = "rukza-marketing-open-id";

export default function MarketingEditRedirectPage() {
  const params = useParams<{ id: string }>();
  const postId = params?.id ?? "";
  const router = useRouter();

  useEffect(() => {
    if (!postId) {
      router.replace("/admin/marketing");
      return;
    }

    try {
      sessionStorage.setItem(OPEN_EDIT_KEY, postId);
    } catch {
      // ignore
    }

    router.replace("/admin/marketing");
  }, [postId, router]);

  return (
    <div className="p-8 text-charcoal/70">
      Opening marketing editor...
    </div>
  );
}
