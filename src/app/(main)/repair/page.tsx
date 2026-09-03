import { redirect } from "next/navigation";

/** Repair service removed — send visitors to the shop. */
export default function RepairPage() {
  redirect("/shop");
}
