import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const orderItemSchema = z.object({
  name: z.string().min(1),
  productCode: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.string().min(1),
  total: z.string().min(1),
});

const checkoutSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  paymentMethod: z.enum(["bank_transfer", "cash_on_delivery"]),
  note: z.string().optional().default(""),
  orderItems: z.array(orderItemSchema).min(1),
  subtotal: z.string().min(1),
  deliveryCost: z.string().min(1),
  total: z.string().min(1),
  itemCount: z.number().int().positive(),
});

type CheckoutPayload = z.infer<typeof checkoutSchema>;

const getText = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildOwnerEmailHtml = (orderNumber: string, payload: CheckoutPayload) => {
  const paymentLabel =
    payload.paymentMethod === "cash_on_delivery"
      ? "Plaćanje pouzećem"
      : "Plaćanje preko računa";

  const rows = payload.orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${getText(item.name)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${getText(item.productCode)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${getText(item.price)} RSD</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${getText(item.total)} RSD</td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#1b1b1b;line-height:1.5;">
      <h2 style="margin-bottom:8px;">Nova porudžbina #${getText(orderNumber)}</h2>
      <p style="margin:0 0 14px;">Kupac: <strong>${getText(payload.fullName)}</strong> (${getText(payload.email)})</p>
      <p style="margin:0 0 6px;">Telefon: ${getText(payload.phone)}</p>
      <p style="margin:0 0 6px;">Adresa: ${getText(payload.address)}, ${getText(payload.city)} ${getText(payload.postalCode)}</p>
      <p style="margin:0 0 10px;">Način plaćanja: ${paymentLabel}</p>
      <p style="margin:0 0 10px;">Napomena: ${getText(payload.note || "-")}</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px;">
        <thead>
          <tr style="text-align:left;background:#fafafa;">
            <th style="padding:8px;border-bottom:1px solid #eee;">Artikal</th>
            <th style="padding:8px;border-bottom:1px solid #eee;">Šifra</th>
            <th style="padding:8px;border-bottom:1px solid #eee;">Količina</th>
            <th style="padding:8px;border-bottom:1px solid #eee;">Cena</th>
            <th style="padding:8px;border-bottom:1px solid #eee;">Ukupno</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <p style="margin:14px 0 0;">Međuzbir: <strong>${getText(payload.subtotal)} RSD</strong></p>
      <p style="margin:4px 0 0;">Dostava: <strong>${getText(payload.deliveryCost)} RSD</strong></p>
      <p style="margin:4px 0 0;font-size:16px;">Ukupno: <strong>${getText(payload.total)} RSD</strong></p>
    </div>
  `;
};

const buildCustomerEmailHtml = (orderNumber: string, payload: CheckoutPayload) => `
  <div style="font-family:Arial,sans-serif;color:#1b1b1b;line-height:1.5;">
    <h2 style="margin-bottom:10px;">Hvala na porudžbini!</h2>
    <p style="margin:0 0 10px;">Poštovani/a ${getText(payload.fullName)}, uspešno smo primili Vašu porudžbinu.</p>
    <p style="margin:0 0 8px;">Broj porudžbine: <strong>#${getText(orderNumber)}</strong></p>
    <p style="margin:0 0 8px;">Ukupan iznos: <strong>${getText(payload.total)} RSD</strong></p>
    <p style="margin:0;">Kontaktiraćemo Vas uskoro radi potvrde i isporuke.</p>
  </div>
`;

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = checkoutSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Neispravni podaci porudžbine",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    const backendBaseUrl = process.env.BASE_URL;
    const backendApiHash = process.env.API_HASH;

    if (!backendBaseUrl || !backendApiHash) {
      return NextResponse.json(
        { error: "Nedostaje backend konfiguracija (BASE_URL ili API_HASH)." },
        { status: 500 },
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const orderRecipientEmail = process.env.ORDER_RECIPIENT_EMAIL;
    const emailSender = process.env.EMAIL_FROM;

    if (!resendApiKey || !orderRecipientEmail || !emailSender) {
      return NextResponse.json(
        {
          error:
            "Nedostaje email konfiguracija (RESEND_API_KEY, ORDER_RECIPIENT_EMAIL, EMAIL_FROM).",
        },
        { status: 500 },
      );
    }

    const nameParts = payload.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const backendOrderData = {
      customer: {
        email: payload.email,
        first_name: firstName,
        last_name: lastName,
        payment_method:
          payload.paymentMethod === "cash_on_delivery" ? "personal" : "invoice",
        billing_address: {
          country_code: "RS",
          address_line1: payload.address,
          locality: payload.city,
          postal_code: payload.postalCode,
          given_name: firstName,
          family_name: lastName,
        },
        shipping_address: {
          country_code: "RS",
          address_line1: payload.address,
          locality: payload.city,
          postal_code: payload.postalCode,
          given_name: firstName,
          family_name: lastName,
          phone_number: payload.phone,
        },
      },
      products: payload.orderItems.map((item) => ({
        product_id: item.productCode,
        quantity: item.quantity,
      })),
    };

    const backendResponse = await fetch(
      `${backendBaseUrl}/api/v1/orders?cc=${backendApiHash}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendOrderData),
      },
    );

    if (!backendResponse.ok) {
      const backendErrorText = await backendResponse.text();
      console.error("Order backend failed:", backendResponse.status, backendErrorText);
      return NextResponse.json(
        { error: "Kreiranje porudžbine nije uspelo." },
        { status: 502 },
      );
    }

    const backendResult = (await backendResponse.json()) as { order_number?: string };
    const orderNumber = backendResult.order_number;

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Backend nije vratio broj porudžbine." },
        { status: 502 },
      );
    }

    const resend = new Resend(resendApiKey);

    const ownerEmailHtml = buildOwnerEmailHtml(orderNumber, payload);
    const customerEmailHtml = buildCustomerEmailHtml(orderNumber, payload);

    await resend.emails.send({
      from: emailSender,
      to: [orderRecipientEmail],
      subject: `[ORDER] #${orderNumber} - ${payload.fullName}`,
      html: ownerEmailHtml,
    });

    await resend.emails.send({
      from: emailSender,
      to: [payload.email],
      subject: `Potvrda porudžbine #${orderNumber}`,
      html: customerEmailHtml,
    });

    return NextResponse.json(
      {
        message: "Porudžbina je uspešno kreirana.",
        orderNumber,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      {
        error: "Došlo je do greške prilikom obrade porudžbine.",
      },
      { status: 500 },
    );
  }
}
