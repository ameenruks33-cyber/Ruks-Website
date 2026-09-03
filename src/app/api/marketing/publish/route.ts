import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api";
import { getStoreCatalog, updateStoreCatalog } from "@/lib/catalog-storage";
import {
  getInstagramCaptionForPost,
  publishMarketingPost,
} from "@/lib/marketing-publish";
import type { MarketingPost } from "@/types/marketing";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let postId = "";
  try {
    const body = await request.json();
    postId = typeof body.postId === "string" ? body.postId : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }

  const catalog = await getStoreCatalog();
  const post = catalog.marketingPosts.find((p) => p.id === postId);
  if (!post) {
    return NextResponse.json({ error: "Marketing post not found" }, { status: 404 });
  }

  if (post.status !== "approved" && post.status !== "scheduled" && post.status !== "draft") {
    return NextResponse.json(
      { error: "Only draft, approved, or scheduled posts can be published" },
      { status: 400 }
    );
  }

  const results = publishMarketingPost(
    post,
    catalog.socialConnections,
    process.env.WHATSAPP_NOTIFY_PHONE
  );

  const updatedPosts = catalog.marketingPosts.map((p) =>
    p.id === postId
      ? {
          ...p,
          status: "published" as const,
          publishedAt: new Date().toISOString(),
          publishError: undefined,
          updatedAt: new Date().toISOString(),
        }
      : p
  );

  await updateStoreCatalog({ marketingPosts: updatedPosts });

  return NextResponse.json({
    success: true,
    results,
    instagramCaption: getInstagramCaptionForPost(post),
  });
}

/** Phase 5: cron endpoint for scheduled posts — always requires CRON_SECRET */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const catalog = await getStoreCatalog();
  const due = catalog.marketingPosts.filter(
    (p: MarketingPost) =>
      p.status === "scheduled" &&
      p.scheduledAt &&
      new Date(p.scheduledAt).getTime() <= Date.now()
  );

  return NextResponse.json({
    phase: 5,
    message: "Scheduler stub — auto-publish for due posts coming in Phase 5",
    dueCount: due.length,
    dueIds: due.map((p) => p.id),
  });
}
