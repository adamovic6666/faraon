import { NextRequest, NextResponse } from "next/server";
import { fetchOrderInvoice } from "@/lib/api/faraon";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId")?.trim();

  if (!orderId) {
    return NextResponse.json(
      { error: "Parametar orderId je obavezan." },
      { status: 400 },
    );
  }

  const result = await fetchOrderInvoice(orderId);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status },
    );
  }

  return NextResponse.json({ success: true, ...result.data });
}
