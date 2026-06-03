import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  buildVposParams,
  generateReqRefNum,
  getBaseUrl,
  getVposUrl,
} from "@/lib/vpos";
import { setPendingOrder } from "@/lib/vpos-pending";

const orderItemSchema = z.object({
  name: z.string().min(1),
  productCode: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.string().min(1),
  total: z.string().min(1),
});

const initPaymentSchema = z.object({
  fullName: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().optional().default(""),
  sprat: z.string().optional().default(""),
  brojStana: z.string().optional().default(""),
  pib: z.string().optional().default(""),
  mb: z.string().optional().default(""),
  note: z.string().optional().default(""),
  cenovnikTermId: z.number().int().positive(),
  shippingPrice: z.number().min(0),
  orderItems: z.array(orderItemSchema).min(1),
  subtotal: z.string().min(1),
  deliveryCost: z.string().min(1),
  total: z.string().min(1),
  itemCount: z.number().int().positive(),
  shippingFieldCode: z.string().optional().default(""),
  shippingBasePrice: z.string().optional().default("0"),
  extraWeightShipments: z.number().int().min(0).optional().default(0),
  extraWeightUnitPrice: z.string().optional().default("0"),
  extraWeightTotalPrice: z.string().optional().default("0"),
  totalWeight: z.string().optional().default(""),
  // 321 delivery
  deliveryAddressId: z.string().min(1),
  deliveryAddressNumber: z.string().min(1),
  deliveryComment: z.string().optional().default(""),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = initPaymentSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Neispravni podaci porudžbine.", details: z.flattenError(parsed.error) },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const totalRsd = Number(payload.total);

    if (!Number.isFinite(totalRsd) || totalRsd <= 0) {
      return NextResponse.json(
        { error: "Neispravan iznos porudžbine." },
        { status: 400 },
      );
    }

    const reqrefnum = generateReqRefNum();
    const baseUrl = getBaseUrl();

    // Store pending order data — retrieved by payment-callback (URLMS)
    setPendingOrder(reqrefnum, {
      ...payload,
      paymentMethod: "card_payment",
      createdAt: Date.now(),
    });

    const vposParams = buildVposParams({
      reqrefnum,
      amountRsd: totalRsd,
      urlback: `${baseUrl}/korpa/checkout?payment_cancelled=1`,
      urldone: `${baseUrl}/api/checkout/payment-return`,
      urlms: `${baseUrl}/api/checkout/payment-callback`,
      langid: "SR",
    });

    return NextResponse.json({
      vposUrl: getVposUrl(),
      params: vposParams,
    });
  } catch (error) {
    console.error("[init-payment] Error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške pri pokretanju plaćanja." },
      { status: 500 },
    );
  }
}
