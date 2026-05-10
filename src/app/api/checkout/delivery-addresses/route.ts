import { NextResponse } from "next/server";

const DOSTAVA_API_BASE = "https://www.dostava321.in.rs/rest/api/integration";
const DOSTAVA_API_KEY = process.env.DOSTAVA321_API_KEY ?? "";

export async function GET() {
  try {
    const response = await fetch(`${DOSTAVA_API_BASE}/addresses`, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": DOSTAVA_API_KEY,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[delivery-addresses] 321 error:", response.status, text);
      return NextResponse.json(
        { error: "Nije moguće učitati listu adresa za dostavu." },
        { status: response.status },
      );
    }

    const data: unknown = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[delivery-addresses] Network error:", err);
    return NextResponse.json(
      { error: "Mrežna greška pri učitavanju adresa." },
      { status: 500 },
    );
  }
}
