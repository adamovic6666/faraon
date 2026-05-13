import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DOSTAVA_API_BASE = "https://www.dostava321.in.rs/rest/api/integration";
const DOSTAVA_API_KEY = process.env.DOSTAVA321_API_KEY ?? "";

const schema = z.object({
  addressId: z.string().min(1),
  addressNumber: z.string().min(1).max(5),
  customerPhoneNumber: z.string().min(1),
  comment: z.string().optional().default(""),
});

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Neispravan JSON payload." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Neispravni podaci za dostavu." },
      { status: 400 },
    );
  }

  const { addressId, addressNumber, customerPhoneNumber, comment } =
    parsed.data;

  const deliveryPayload = {
    addressId,
    addressNumber,
    preparationTime: 15,
    customerPhoneNumber,
    comment: comment || "",
    voucher: "yes",
  };

  try {
    const response = await fetch(`${DOSTAVA_API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": DOSTAVA_API_KEY,
      },
      body: JSON.stringify(deliveryPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[delivery-order] 321 error:",
        response.status,
        errorText,
      );
      return NextResponse.json(
        { error: "Greška pri slanju narudžbine dostavljaču." },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[delivery-order] Network error:", err);
    return NextResponse.json(
      { error: "Mrežna greška pri slanju narudžbine dostavljaču." },
      { status: 500 },
    );
  }
}
