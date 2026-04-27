import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchShippingRate } from "@/lib/api/faraon";

const requestSchema = z.object({
  cenovnikTermId: z.number().int().positive(),
  products: z.array(
    z.object({
      sku: z.string().min(1),
      quantity: z.number().int().positive(),
    }),
  ).min(1),
});

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan JSON payload." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Neispravni podaci za obračun dostave." },
      { status: 400 },
    );
  }

  const result = await fetchShippingRate({
    cenovnikTermId: parsed.data.cenovnikTermId,
    products: parsed.data.products,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status },
    );
  }

  return NextResponse.json({ success: true, data: result.data });
}
