import { NextResponse } from "next/server";
import { addRepairRequest, readRepairRequests } from "@/lib/repair-storage";
import { isAdminRequest } from "@/lib/admin-api";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const requests = await readRepairRequests();
  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const required = [
      "productType",
      "problem",
      "customerName",
      "phone",
      "address",
      "pincode",
      "district",
      "preferredDate",
      "preferredTime",
    ] as const;

    for (const field of required) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const entry = await addRepairRequest({
      productType: body.productType,
      problem: body.problem,
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      pincode: body.pincode,
      district: body.district,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      description: body.description || "",
    });

    return NextResponse.json({ success: true, request: entry });
  } catch {
    return NextResponse.json({ error: "Failed to submit repair request" }, { status: 500 });
  }
}
