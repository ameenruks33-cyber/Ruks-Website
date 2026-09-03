import { redirect } from "next/navigation";

/** Old edit URLs used to hang on "Loading...". Always send them to the list. */
export default async function MarketingEditRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  redirect("/admin/marketing");
}
