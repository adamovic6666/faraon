import { NextResponse } from "next/server";
import { fetchPricingTerms } from "@/lib/api/faraon";

export async function GET() {
  const result = await fetchPricingTerms();

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status },
    );
  }

  return NextResponse.json({ success: true, data: result.data });
}
