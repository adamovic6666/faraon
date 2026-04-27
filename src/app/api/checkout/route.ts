import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createOrder, fetchOrderInvoice } from "@/lib/api/faraon";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
const storeEmail = process.env.ORDER_RECIPIENT_EMAIL ?? emailFrom;
const INVOICE_MAX_WAIT_MS = 15000;
const INVOICE_RETRY_DELAY_MS = 3000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type InvoicePdfPayload = {
  fileName: string;
  mimeType: string;
  contentBase64: string;
};

const resolveInvoicePdf = async (
  orderId: string,
): Promise<InvoicePdfPayload | null> => {
  const startedAt = Date.now();

  do {
    const invoiceResult = await fetchOrderInvoice(orderId);

    if (invoiceResult.ok) {
      return {
        fileName: invoiceResult.data.fileName,
        mimeType: invoiceResult.data.mimeType,
        contentBase64: invoiceResult.data.contentBase64,
      };
    }

    if (Date.now() - startedAt >= INVOICE_MAX_WAIT_MS) {
      break;
    }

    await wait(INVOICE_RETRY_DELAY_MS);
  } while (true);

  return null;
};

const orderItemSchema = z.object({
  name: z.string().min(1),
  productCode: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.string().min(1),
  total: z.string().min(1),
});

const PIB_REGEX = /^\d{9}$/;
const MB_REGEX = /^\d{8}$/;

const checkoutSchema = z
  .object({
    fullName: z.string().min(1),
    email: z.email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    paymentMethod: z.enum(["bank_transfer", "cash_on_delivery"]),
    customerType: z.enum(["personal", "business"]).default("personal"),
    pib: z.string().optional().default(""),
    mb: z.string().optional().default(""),
    note: z.string().optional().default(""),
    cenovnikTermId: z.number().int().positive(),
    orderItems: z.array(orderItemSchema).min(1),
    subtotal: z.string().min(1),
    deliveryCost: z.string().min(1),
    total: z.string().min(1),
    itemCount: z.number().int().positive(),
  })
  .superRefine((data, ctx) => {
    if (data.customerType === "business") {
      const normalizedPib = data.pib?.trim().replaceAll(" ", "") ?? "";
      const normalizedMb = data.mb?.trim().replaceAll(" ", "") ?? "";

      if (!PIB_REGEX.test(normalizedPib)) {
        ctx.addIssue({
          code: "custom",
          path: ["pib"],
          message: "PIB mora imati tačno 9 cifara.",
        });
      }

      if (!MB_REGEX.test(normalizedMb)) {
        ctx.addIssue({
          code: "custom",
          path: ["mb"],
          message: "Matični broj mora imati tačno 8 cifara.",
        });
      }
    }
  });

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = checkoutSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Neispravni podaci porudžbine.",
          details: z.flattenError(parsed.error),
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    console.log("[checkout] Incoming payload:", payload);

    const nameParts = payload.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const shippingAddress = {
      country_code: "RS",
      address_line1: payload.address,
      locality: payload.city,
      postal_code: payload.postalCode,
      given_name: firstName,
      family_name: lastName,
      phone_number: payload.phone,
      ...(payload.customerType === "business"
        ? {
            pib: payload.pib.trim(),
            mb: payload.mb.trim(),
          }
        : {}),
    };

    const paymentMethod: "personal" | "invoice" =
      payload.paymentMethod === "bank_transfer" ? "invoice" : "personal";

    const backendOrderData = {
      customer: {
        payment_method: paymentMethod,
        cenovnik_term_id: payload.cenovnikTermId,
        email: payload.email,
        billing_address: {
          country_code: "RS",
          address_line1: payload.address,
          locality: payload.city,
          postal_code: payload.postalCode,
          given_name: firstName,
          family_name: lastName,
        },
        shipping_address: shippingAddress,
      },
      products: payload.orderItems.map((item) => ({
        product_id: item.productCode,
        quantity: item.quantity,
      })),
    };

    console.log("[checkout] Backend order payload:", backendOrderData);

    const result = await createOrder(backendOrderData);

    console.log("[checkout] Create order response:", result);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status: result.status },
      );
    }

    const { orderId, orderNumber } = result.data;
    const emailWarnings: string[] = [];
    const shouldAttachInvoice = paymentMethod === "invoice";
    const invoicePdf = shouldAttachInvoice
      ? await resolveInvoicePdf(orderId)
      : null;

    const paymentLabel =
      payload.paymentMethod === "bank_transfer"
        ? "Prenos na račun"
        : "Plaćanje pouzećem";

        const itemsHtml = payload.orderItems
          .map(
            (item) =>
              `<tr>
                <td style="padding:12px;border-bottom:1px solid #e5d9ca;font-size:14px;color:#5b544d;">${item.productCode}</td>
                <td style="padding:12px;border-bottom:1px solid #e5d9ca;font-size:14px;font-weight:700;color:#1b1b1b;">${item.name}</td>
                <td style="padding:12px;border-bottom:1px solid #e5d9ca;font-size:14px;text-align:center;color:#1b1b1b;">${item.quantity}</td>
                <td style="padding:12px;border-bottom:1px solid #e5d9ca;font-size:14px;text-align:right;color:#1b1b1b;white-space:nowrap;">${item.total} RSD</td>
              </tr>`,
          )
          .join("");

        const ownerHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Primljena je nova porudžbina</title>
  </head>
  <body style="margin:0;padding:24px 12px;background:#f5f1ea;font-family:Arial,sans-serif;color:#1b1b1b;line-height:1.6;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5d9ca;">
      <div style="padding:24px 30px;background:#f8f5ef;border-bottom:3px solid #ac0000;overflow:hidden;">
        <div style="float:left;width:48%;">
          <div style="font-size:18px;line-height:1.1;font-weight:900;letter-spacing:0.04em;color:#ac0000;text-transform:uppercase;">FARAON DISKONTI</div>
        </div>
        <div style="float:right;width:48%;text-align:right;font-size:12px;line-height:1.65;color:#5b544d;">
          <strong style="display:block;font-size:13px;color:#1b1b1b;margin-bottom:4px;">STR Diskont pića Faraon PS</strong>
          Karlovački put 1<br />21132 Petrovaradin<br />T: 062 801 7376<br />E: info@faraondiskonti.rs<br />PIB: 104032720
        </div>
        <div style="clear:both;"></div>
      </div>
      <div style="background:#ac0000;color:#ffffff;padding:22px 32px;text-align:center;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;opacity:0.9;">Nova porudžbina</div>
        <h1 style="margin:10px 0 0;font-size:30px;line-height:1.15;font-weight:900;">Primljena je nova porudžbina</h1>
      </div>
      <div style="background:#FFB200;color:#1b1b1b;padding:15px 32px;text-align:center;font-size:20px;font-weight:800;">Porudžbina #${orderNumber}</div>
      <div style="padding:32px;">
        <div style="margin-bottom:24px;padding:20px 22px;border:2px solid #f0d28a;border-radius:8px;background:#fff8e7;">
          <h2 style="color:#ac0000;font-size:18px;border-bottom:2px solid #FFB200;padding-bottom:8px;margin:0 0 16px;font-weight:800;">Podaci o kupcu</h2>
          <p style="margin:6px 0;"><strong>Ime i prezime:</strong> ${payload.fullName}</p>
          <p style="margin:6px 0;"><strong>Email:</strong> ${payload.email}</p>
          <p style="margin:6px 0;"><strong>Telefon:</strong> ${payload.phone}</p>
          <p style="margin:6px 0;"><strong>Adresa:</strong> ${payload.address}, ${payload.postalCode} ${payload.city}</p>
          <p style="margin:6px 0;"><strong>Napomena:</strong> ${payload.note || "-"}</p>
        </div>
        <div style="margin-bottom:24px;padding:18px 20px;border:2px solid #ac0000;border-radius:8px;background:#fffaf6;">
          <h2 style="color:#ac0000;font-size:18px;border-bottom:2px solid #FFB200;padding-bottom:8px;margin:0 0 16px;font-weight:800;">Način plaćanja</h2>
          <p style="margin:0;font-weight:700;color:#1b1b1b;">${paymentLabel}</p>
          <p style="margin:8px 0 0;color:#5b544d;">${
            payload.paymentMethod === "bank_transfer"
              ? "Iznos navedene porudžbine se plaća prevodom na račun Faraon Diskonti."
              : "Iznos navedene porudžbine plaćate kuriru prilikom preuzimanja pošiljke."
          }</p>
        </div>
        <div style="margin-bottom:18px;">
          <h2 style="color:#ac0000;font-size:18px;border-bottom:2px solid #FFB200;padding-bottom:8px;margin:0 0 16px;font-weight:800;">Sadržaj porudžbine</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:10px;">
            <thead>
              <tr style="background:#ac0000;color:#fff;">
                <th style="padding:12px;text-align:left;font-size:14px;">Šifra</th>
                <th style="padding:12px;text-align:left;font-size:14px;">Proizvod</th>
                <th style="padding:12px;text-align:center;font-size:14px;">Količina</th>
                <th style="padding:12px;text-align:right;font-size:14px;">Ukupno</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <table style="width:100%;margin-top:20px;border-collapse:collapse;">
            <tr style="border-top:1px solid #e5d9ca;">
              <td style="padding:12px 10px;text-align:right;font-size:15px;font-weight:600;color:#1b1b1b;">Međuzbir:</td>
              <td style="padding:12px 10px;text-align:right;font-size:15px;color:#1b1b1b;width:170px;white-space:nowrap;">${payload.subtotal} RSD</td>
            </tr>
            <tr>
              <td style="padding:12px 10px;text-align:right;font-size:15px;font-weight:600;color:#1b1b1b;">Troškovi isporuke:</td>
              <td style="padding:12px 10px;text-align:right;font-size:15px;color:#1b1b1b;white-space:nowrap;">${payload.deliveryCost} RSD</td>
            </tr>
            <tr style="border-top:2px solid #ac0000;">
              <td style="padding:15px 10px;text-align:right;font-size:21px;font-weight:800;color:#ac0000;">UKUPNO ZA NAPLATU:</td>
              <td style="padding:15px 10px;text-align:right;font-size:21px;font-weight:800;color:#ac0000;white-space:nowrap;">${payload.total} RSD</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:10px;text-align:right;font-size:12px;color:#5b544d;font-style:italic;">* PDV uračunat u cenu</td>
            </tr>
          </table>
        </div>
      </div>
      <div style="background:#8c0000;padding:24px 32px;text-align:center;color:#fff;">
        <p style="margin:0 0 8px;font-size:17px;font-weight:800;">Srdačan pozdrav,</p>
        <p style="margin:0 0 8px;font-size:15px;font-weight:700;">STR Diskont pića Faraon PS</p>
        <p style="margin:0;font-size:13px;opacity:0.92;">info@faraondiskonti.rs | 062 801 7376</p>
      </div>
    </div>
  </body>
</html>`;

        const customerHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Potvrda porudžbine</title>
  </head>
  <body style="margin:0;padding:24px 12px;background:#f5f1ea;font-family:Arial,sans-serif;color:#1b1b1b;line-height:1.6;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5d9ca;">
      <div style="padding:24px 30px;background:#f8f5ef;border-bottom:3px solid #ac0000;overflow:hidden;">
        <div style="float:left;width:48%;">
          <div style="font-size:18px;line-height:1.1;font-weight:900;letter-spacing:0.04em;color:#ac0000;text-transform:uppercase;">FARAON DISKONTI</div>
        </div>
        <div style="float:right;width:48%;text-align:right;font-size:12px;line-height:1.65;color:#5b544d;">
          <strong style="display:block;font-size:13px;color:#1b1b1b;margin-bottom:4px;">STR Diskont pića Faraon PS</strong>
          Karlovački put 1<br />21132 Petrovaradin<br />T: 062 801 7376<br />E: info@faraondiskonti.rs<br />PIB: 104032720
        </div>
        <div style="clear:both;"></div>
      </div>
      <div style="background:#ac0000;color:#ffffff;padding:22px 32px;text-align:center;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;opacity:0.9;">Potvrda porudžbine</div>
        <h1 style="margin:10px 0 0;font-size:30px;line-height:1.15;font-weight:900;">Hvala na kupovini!</h1>
      </div>
      <div style="background:#FFB200;color:#1b1b1b;padding:15px 32px;text-align:center;font-size:20px;font-weight:800;">Porudžbina #${orderNumber}</div>
      <div style="padding:32px;">
        <p style="margin:0 0 20px;font-size:16px;color:#1b1b1b;">Vaša porudžbina je uspešno evidentirana i uskoro ćemo Vas kontaktirati radi potvrde i dogovora oko isporuke.</p>
        ${
          payload.paymentMethod === "bank_transfer"
            ? `<div style="margin-bottom:24px;padding:18px 20px;border:2px solid #ac0000;border-radius:8px;background:#fffaf6;">
          <p style="margin:0;font-weight:700;color:#ac0000;">Prenos na račun</p>
          <p style="margin:8px 0 0;color:#5b544d;">Uplatu izvršite na račun Faraon Diskonti. Faktura je u prilogu kada je backend generiše, a dostupna je i na stranici uspešne porudžbine.</p>
        </div>`
            : ""
        }
        <h2 style="color:#ac0000;font-size:18px;border-bottom:2px solid #FFB200;padding-bottom:8px;margin:24px 0 16px;font-weight:800;">Vaša porudžbina</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:10px;">
          <thead>
            <tr style="background:#ac0000;color:#fff;">
              <th style="padding:12px;text-align:left;font-size:14px;">Proizvod</th>
              <th style="padding:12px;text-align:center;font-size:14px;">Količina</th>
              <th style="padding:12px;text-align:right;font-size:14px;">Ukupno</th>
            </tr>
          </thead>
          <tbody>${payload.orderItems
            .map(
              (item) =>
                `<tr>
              <td style="padding:12px;border-bottom:1px solid #e5d9ca;font-size:14px;font-weight:700;color:#1b1b1b;">${item.name}</td>
              <td style="padding:12px;border-bottom:1px solid #e5d9ca;font-size:14px;text-align:center;color:#1b1b1b;">${item.quantity}</td>
              <td style="padding:12px;border-bottom:1px solid #e5d9ca;font-size:14px;text-align:right;color:#1b1b1b;white-space:nowrap;">${item.total} RSD</td>
            </tr>`,
            )
            .join("")}</tbody>
        </table>
        <table style="width:100%;margin-top:20px;border-collapse:collapse;">
          <tr style="border-top:1px solid #e5d9ca;">
            <td style="padding:12px 10px;text-align:right;font-size:15px;font-weight:600;color:#1b1b1b;">Međuzbir:</td>
            <td style="padding:12px 10px;text-align:right;font-size:15px;color:#1b1b1b;width:170px;white-space:nowrap;">${payload.subtotal} RSD</td>
          </tr>
          <tr>
            <td style="padding:12px 10px;text-align:right;font-size:15px;font-weight:600;color:#1b1b1b;">Troškovi isporuke:</td>
            <td style="padding:12px 10px;text-align:right;font-size:15px;color:#1b1b1b;white-space:nowrap;">${payload.deliveryCost} RSD</td>
          </tr>
          <tr style="border-top:2px solid #ac0000;">
            <td style="padding:15px 10px;text-align:right;font-size:21px;font-weight:800;color:#ac0000;">UKUPNO ZA NAPLATU:</td>
            <td style="padding:15px 10px;text-align:right;font-size:21px;font-weight:800;color:#ac0000;white-space:nowrap;">${payload.total} RSD</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:10px;text-align:right;font-size:12px;color:#5b544d;font-style:italic;">* PDV uračunat u cenu</td>
          </tr>
        </table>
      </div>
      <div style="background:#8c0000;padding:24px 32px;text-align:center;color:#fff;">
        <p style="margin:0 0 8px;font-size:17px;font-weight:800;">Srdačan pozdrav,</p>
        <p style="margin:0 0 8px;font-size:15px;font-weight:700;">STR Diskont pića Faraon PS</p>
        <p style="margin:0;font-size:13px;opacity:0.92;">info@faraondiskonti.rs | 062 801 7376</p>
      </div>
    </div>
  </body>
</html>`;

    if (shouldAttachInvoice && !invoicePdf) {
      emailWarnings.push(
        "Faktura nije bila spremna za slanje u email prilogu.",
      );
    }

    const emailAttachments = invoicePdf
      ? [
          {
            filename: invoicePdf.fileName,
            content: Buffer.from(invoicePdf.contentBase64, "base64"),
            content_type: invoicePdf.mimeType,
          },
        ]
      : undefined;

    const ownerEmailResult = await resend.emails.send({
      from: emailFrom,
      to: storeEmail,
      subject: `[ORDER] #${orderNumber} - ${payload.fullName}`,
      html: ownerHtml,
      attachments: emailAttachments,
    });

    if (ownerEmailResult.error) {
      console.error("Owner email send failed:", ownerEmailResult.error);
      emailWarnings.push("Neuspešno slanje emaila za vlasnika porudžbine.");
    }

    const customerEmailResult = await resend.emails.send({
      from: emailFrom,
      to: payload.email,
      subject: `Potvrda porudžbine #${orderNumber}`,
      html: customerHtml,
      attachments: emailAttachments,
    });

    if (customerEmailResult.error) {
      console.error("Customer email send failed:", customerEmailResult.error);
      emailWarnings.push("Neuspešno slanje emaila za kupca.");
    }

    return NextResponse.json(
      {
        success: true,
        message: result.data.message,
        orderId,
        orderNumber,
        paymentMethod: payload.paymentMethod,
        warrantUrl: result.data.warrant?.url ?? "",
        warrantFileName: result.data.warrant?.fileName ?? "",
        warnings: emailWarnings,
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
