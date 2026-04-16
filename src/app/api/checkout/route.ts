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
  email: z.email(),
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

const STORE_INFO = {
  storefrontName: "FARAON DISKONTI",
  legalName: "STR Diskont pi\u0107a Faraon PS",
  addressLine1: "Karlova\u010dki put 1",
  addressLine2: "21132 Petrovaradin",
  phone: "062 801 7376",
  email: "info@faraondiskonti.rs",
  pib: "104032720",
};

const EMAIL_COLORS = {
  brand: "#ac0000",
  brandDark: "#8c0000",
  primary: "#FFB200",
  background: "#f5f1ea",
  panel: "#ffffff",
  panelMuted: "#fbf7f1",
  panelSoft: "#f8f5ef",
  text: "#1b1b1b",
  textMuted: "#5b544d",
  border: "#e5d9ca",
};

const EMAIL_FONTS = {
  body: 'Arial, Helvetica, sans-serif',
  heading: 'Oswald, Arial Narrow, Arial, Helvetica, sans-serif',
};

const getText = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getPaymentLabel = (paymentMethod: CheckoutPayload["paymentMethod"]) =>
  paymentMethod === "cash_on_delivery"
    ? "Pla\u0107anje pouze\u0107em"
    : "Pla\u0107anje preko ra\u010duna";

const getPaymentDescription = (
  paymentMethod: CheckoutPayload["paymentMethod"],
) =>
  paymentMethod === "cash_on_delivery"
    ? "Iznos navedene porud\u017ebine pla\u0107ate kuriru prilikom preuzimanja po\u0161iljke."
    : "Nakon potvrde porud\u017ebine dobi\u0107ete instrukcije za uplatu, a isporuka kre\u0107e po evidentiranju uplate.";

const buildOrderRows = (payload: CheckoutPayload) =>
  payload.orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid ${EMAIL_COLORS.border};font-size:14px;color:${EMAIL_COLORS.textMuted};">${getText(item.productCode)}</td>
          <td style="padding:12px;border-bottom:1px solid ${EMAIL_COLORS.border};font-size:14px;font-weight:700;color:${EMAIL_COLORS.text};">${getText(item.name)}</td>
          <td style="padding:12px;border-bottom:1px solid ${EMAIL_COLORS.border};font-size:14px;text-align:center;color:${EMAIL_COLORS.text};">${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid ${EMAIL_COLORS.border};font-size:14px;text-align:right;color:${EMAIL_COLORS.text};white-space:nowrap;">${getText(item.total)} RSD</td>
        </tr>
      `,
    )
    .join("");

const buildTotalsTable = (payload: CheckoutPayload, totalLabel: string) => `
  <table style="width:100%;margin-top:20px;border-collapse:collapse;">
    <tr style="border-top:1px solid ${EMAIL_COLORS.border};">
      <td style="padding:12px 10px;text-align:right;font-size:15px;font-weight:600;color:${EMAIL_COLORS.text};">
        Me\u0111uzbir:
      </td>
      <td style="padding:12px 10px;text-align:right;font-size:15px;color:${EMAIL_COLORS.text};width:170px;white-space:nowrap;">
        ${getText(payload.subtotal)} RSD
      </td>
    </tr>
    <tr>
      <td style="padding:12px 10px;text-align:right;font-size:15px;font-weight:600;color:${EMAIL_COLORS.text};">
        Tro\u0161kovi isporuke:
      </td>
      <td style="padding:12px 10px;text-align:right;font-size:15px;color:${EMAIL_COLORS.text};white-space:nowrap;">
        ${getText(payload.deliveryCost)} RSD
      </td>
    </tr>
    <tr style="border-top:2px solid ${EMAIL_COLORS.brand};">
      <td style="padding:15px 10px;text-align:right;font-size:21px;font-weight:800;color:${EMAIL_COLORS.brand};">
        ${getText(totalLabel)}
      </td>
      <td style="padding:15px 10px;text-align:right;font-size:21px;font-weight:800;color:${EMAIL_COLORS.brand};white-space:nowrap;">
        ${getText(payload.total)} RSD
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:10px;text-align:right;font-size:12px;color:${EMAIL_COLORS.textMuted};font-style:italic;">
        * PDV ura\u010dunat u cenu
      </td>
    </tr>
  </table>
`;

const buildSectionTitle = (title: string) => `
  <h2 style="font-family:${EMAIL_FONTS.heading};color:${EMAIL_COLORS.brand};font-size:18px;border-bottom:2px solid ${EMAIL_COLORS.primary};padding-bottom:8px;margin:0 0 16px;font-weight:800;letter-spacing:0.01em;">
    ${getText(title)}
  </h2>
`;

type EmailLayoutProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  content: string;
};

const buildEmailLayout = ({
  eyebrow,
  title,
  subtitle,
  content,
}: EmailLayoutProps) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${getText(title)}</title>
    </head>
    <body style="margin:0;padding:24px 12px;background:${EMAIL_COLORS.background};font-family:${EMAIL_FONTS.body};color:${EMAIL_COLORS.text};line-height:1.6;">
      <div style="max-width:680px;margin:0 auto;background:${EMAIL_COLORS.panel};border:1px solid ${EMAIL_COLORS.border};">
        <div style="padding:24px 30px;background:${EMAIL_COLORS.panelSoft};border-bottom:3px solid ${EMAIL_COLORS.brand};overflow:hidden;">
          <div style="float:left;width:48%;">
            <div style="font-family:${EMAIL_FONTS.heading};font-size:18px;line-height:1.1;font-weight:900;letter-spacing:0.04em;color:${EMAIL_COLORS.brand};text-transform:uppercase;">
              ${getText(STORE_INFO.storefrontName)}
            </div>
          </div>
          <div style="float:right;width:48%;text-align:right;font-size:12px;line-height:1.65;color:${EMAIL_COLORS.textMuted};">
            <strong style="display:block;font-size:13px;color:${EMAIL_COLORS.text};margin-bottom:4px;">${getText(STORE_INFO.legalName)}</strong>
            ${getText(STORE_INFO.addressLine1)}<br />
            ${getText(STORE_INFO.addressLine2)}<br />
            T: ${getText(STORE_INFO.phone)}<br />
            E: ${getText(STORE_INFO.email)}<br />
            PIB: ${getText(STORE_INFO.pib)}
          </div>
          <div style="clear:both;"></div>
        </div>

        <div style="background:${EMAIL_COLORS.brand};color:#ffffff;padding:22px 32px;text-align:center;">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;opacity:0.9;">${getText(eyebrow)}</div>
          <h1 style="font-family:${EMAIL_FONTS.heading};margin:10px 0 0;font-size:30px;line-height:1.15;font-weight:900;letter-spacing:0.01em;">${getText(title)}</h1>
        </div>

        <div style="font-family:${EMAIL_FONTS.heading};background:${EMAIL_COLORS.primary};color:${EMAIL_COLORS.text};padding:15px 32px;text-align:center;font-size:20px;font-weight:800;letter-spacing:0.01em;">
          ${getText(subtitle)}
        </div>

        <div style="padding:32px;">
          ${content}
        </div>

        <div style="background:${EMAIL_COLORS.brandDark};padding:24px 32px;text-align:center;color:#fff;">
          <p style="font-family:${EMAIL_FONTS.heading};margin:0 0 8px;font-size:17px;font-weight:800;letter-spacing:0.01em;">Srda\u010dan pozdrav,</p>
          <p style="font-family:${EMAIL_FONTS.heading};margin:0 0 8px;font-size:15px;font-weight:700;letter-spacing:0.01em;">${getText(STORE_INFO.legalName)}</p>
          <p style="margin:0;font-size:13px;opacity:0.92;">${getText(STORE_INFO.email)} | ${getText(STORE_INFO.phone)}</p>
        </div>
      </div>
    </body>
  </html>
`;

const buildOwnerEmailHtml = (orderNumber: string, payload: CheckoutPayload) => {
  const content = `
    <div style="margin-bottom:24px;padding:20px 22px;border:2px solid #f0d28a;border-radius:8px;background:#fff8e7;">
      ${buildSectionTitle("Podaci o kupcu")}
      <p style="margin:6px 0;"><strong>Ime i prezime:</strong> ${getText(payload.fullName)}</p>
      <p style="margin:6px 0;"><strong>Email:</strong> ${getText(payload.email)}</p>
      <p style="margin:6px 0;"><strong>Telefon:</strong> ${getText(payload.phone)}</p>
      <p style="margin:6px 0;"><strong>Adresa:</strong> ${getText(payload.address)}, ${getText(payload.city)} ${getText(payload.postalCode)}</p>
      <p style="margin:6px 0;"><strong>Napomena:</strong> ${getText(payload.note || "-")}</p>
    </div>

    <div style="margin-bottom:24px;padding:18px 20px;border:2px solid ${EMAIL_COLORS.brand};border-radius:8px;background:#fffaf6;">
      ${buildSectionTitle("Način plaćanja")}
      <p style="margin:0;font-weight:700;color:${EMAIL_COLORS.text};">${getText(getPaymentLabel(payload.paymentMethod))}</p>
      <p style="margin:8px 0 0;color:${EMAIL_COLORS.textMuted};">${getText(getPaymentDescription(payload.paymentMethod))}</p>
    </div>

    <div style="margin-bottom:18px;">
      ${buildSectionTitle("Sadržaj porudžbine")}
      <table style="width:100%;border-collapse:collapse;margin-top:10px;">
        <thead>
          <tr style="background:${EMAIL_COLORS.brand};color:#fff;">
            <th style="padding:12px;text-align:left;font-size:14px;">Šifra</th>
            <th style="padding:12px;text-align:left;font-size:14px;">Proizvod</th>
            <th style="padding:12px;text-align:center;font-size:14px;">Količina</th>
            <th style="padding:12px;text-align:right;font-size:14px;">Ukupno</th>
          </tr>
        </thead>
        <tbody>${buildOrderRows(payload)}</tbody>
      </table>
      ${buildTotalsTable(payload, "UKUPNO ZA NAPLATU:")}
    </div>
  `;

  return buildEmailLayout({
    eyebrow: "Nova porudžbina",
    title: "Primljena je nova porudžbina",
    subtitle: `Porudžbina #${orderNumber}`,
    content,
  });
};

const buildCustomerEmailHtml = (orderNumber: string, payload: CheckoutPayload) => {
  const content = `
    <p style="margin:0 0 18px;font-size:17px;">Poštovani/a <strong>${getText(payload.fullName)}</strong>,</p>
    <p style="margin:0 0 24px;font-size:16px;color:${EMAIL_COLORS.text};">
      Hvala na kupovini u Faraon Diskontima. Vaša porudžbina je uspešno evidentirana i biće obrađena u najkraćem mogućem roku.
    </p>

    <div style="margin-bottom:18px;">
      ${buildSectionTitle("Sadržaj porudžbine")}
      <table style="width:100%;border-collapse:collapse;margin-top:10px;">
        <thead>
          <tr style="background:${EMAIL_COLORS.panelSoft};color:${EMAIL_COLORS.text};border-top:2px solid ${EMAIL_COLORS.primary};border-bottom:2px solid ${EMAIL_COLORS.brand};">
            <th style="padding:12px;text-align:left;font-size:14px;">Šifra</th>
            <th style="padding:12px;text-align:left;font-size:14px;">Proizvod</th>
            <th style="padding:12px;text-align:center;font-size:14px;">Količina</th>
            <th style="padding:12px;text-align:right;font-size:14px;">Cena</th>
          </tr>
        </thead>
        <tbody>${buildOrderRows(payload)}</tbody>
      </table>
      ${buildTotalsTable(payload, "UKUPNO:")}
    </div>

    <div style="margin:24px 0;padding:18px 20px;border:2px solid ${EMAIL_COLORS.primary};border-radius:8px;background:#fff8e7;">
      ${buildSectionTitle("Plaćanje")}
      <h3 style="font-family:${EMAIL_FONTS.heading};margin:0 0 10px;font-size:18px;color:${EMAIL_COLORS.brand};letter-spacing:0.01em;">${getText(getPaymentLabel(payload.paymentMethod))}</h3>
      <p style="margin:0;color:${EMAIL_COLORS.textMuted};">${getText(getPaymentDescription(payload.paymentMethod))}</p>
    </div>

    <div style="margin:24px 0;padding:18px 20px;border-radius:8px;background:${EMAIL_COLORS.panelSoft};">
      ${buildSectionTitle("Podaci za isporuku")}
      <p style="margin:5px 0;"><strong>${getText(payload.fullName)}</strong></p>
      <p style="margin:5px 0;">${getText(payload.address)}</p>
      <p style="margin:5px 0;">${getText(payload.city)}, ${getText(payload.postalCode)}</p>
      <p style="margin:5px 0;">Telefon: ${getText(payload.phone)}</p>
    </div>

    <div style="padding:20px;border-radius:8px;background:${EMAIL_COLORS.panelSoft};color:${EMAIL_COLORS.textMuted};font-size:14px;line-height:1.8;">
      ${buildSectionTitle("Uslovi plaćanja i isporuke")}
      <p style="margin:0 0 10px;">Cene svih proizvoda izražene su u dinarima (RSD) i uključuju PDV.</p>
      <p style="margin:0 0 10px;">Isporuku vrši kurirska služba na adresu navedenu u porudžbini. Troškovi isporuke su fiksni i dodaju se na ukupnu vrednost porudžbine.</p>
      <p style="margin:0;">Za dodatne informacije odgovorićemo Vam na ${getText(STORE_INFO.email)} ili ${getText(STORE_INFO.phone)}.</p>
    </div>
  `;

  return buildEmailLayout({
    eyebrow: "Porudžbina uspešna",
    title: "Hvala na kupovini",
    subtitle: `Broj porudžbine #${orderNumber}`,
    content,
  });
};

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = checkoutSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Neispravni podaci porudžbine",
          details: z.flattenError(parsed.error),
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
