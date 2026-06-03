import { Resend } from "resend";
import type { PendingVposOrder } from "@/lib/vpos-pending";

export type WarrantPdfAttachment = {
  filename: string;
  content: Buffer;
  content_type: string;
};

export type CardEmailPayload = {
  orderNumber: string;
  orderId: string;
  vposOrderId?: string;
  authorcode?: string;
  pending: PendingVposOrder;
  warrantPdf?: WarrantPdfAttachment;
};

const fmtRSD = (s: string): string => {
  const n = Number.parseFloat(s.replaceAll(",", ""));
  if (Number.isNaN(n)) return s;
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `${intPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ".")},${decPart}`;
};

export const sendCardPaymentEmails = async (p: CardEmailPayload): Promise<void> => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const emailFrom = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
  const storeEmail = process.env.ORDER_RECIPIENT_EMAIL ?? emailFrom;

  const { orderNumber, vposOrderId = "", authorcode = "", pending, warrantPdf } = p;
  const bd = "border-bottom:1px solid #e5d9ca;";
  const hasExtraWeight = pending.extraWeightShipments > 0;

  const deliveryRowsHtml = [
    `<tr>
      <td style="padding:12px;${hasExtraWeight ? bd : ""}font-size:14px;color:#5b544d;">${pending.shippingFieldCode || "9001"}</td>
      <td style="padding:12px;${hasExtraWeight ? bd : ""}font-size:14px;font-weight:700;color:#1b1b1b;">Dostava ${pending.city}</td>
      <td style="padding:12px;${hasExtraWeight ? bd : ""}font-size:14px;text-align:center;color:#1b1b1b;">1</td>
      <td style="padding:12px;${hasExtraWeight ? bd : ""}font-size:14px;text-align:right;color:#1b1b1b;white-space:nowrap;">${fmtRSD(pending.shippingBasePrice)} RSD</td>
    </tr>`,
    ...(hasExtraWeight
      ? [`<tr>
        <td style="padding:12px;font-size:14px;color:#5b544d;">9000</td>
        <td style="padding:12px;font-size:14px;font-weight:700;color:#1b1b1b;">Dostava dodatni kg (${pending.extraWeightShipments} × ${fmtRSD(pending.extraWeightUnitPrice)} RSD)</td>
        <td style="padding:12px;font-size:14px;text-align:center;color:#1b1b1b;">${pending.extraWeightShipments}</td>
        <td style="padding:12px;font-size:14px;text-align:right;color:#1b1b1b;white-space:nowrap;">${fmtRSD(pending.extraWeightTotalPrice)} RSD</td>
      </tr>`]
      : []),
  ].join("");

  const itemsHtml = [
    ...pending.orderItems.map(
      (item) =>
        `<tr>
          <td style="padding:12px;${bd}font-size:14px;color:#5b544d;">${item.productCode}</td>
          <td style="padding:12px;${bd}font-size:14px;font-weight:700;color:#1b1b1b;">${item.name}</td>
          <td style="padding:12px;${bd}font-size:14px;text-align:center;color:#1b1b1b;">${item.quantity}</td>
          <td style="padding:12px;${bd}font-size:14px;text-align:right;color:#1b1b1b;white-space:nowrap;">${fmtRSD(item.price)} RSD</td>
        </tr>`,
    ),
    deliveryRowsHtml,
  ].join("");

  const ownerHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><title>Nova porudžbina (kartica)</title></head>
<body style="margin:0;padding:24px 12px;background:#f5f1ea;font-family:Arial,sans-serif;color:#1b1b1b;line-height:1.6;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5d9ca;">
    <div style="padding:24px 30px;background:#f8f5ef;border-bottom:3px solid #ac0000;overflow:hidden;">
      <div style="float:left;width:48%;"><div style="font-size:18px;font-weight:900;letter-spacing:0.04em;color:#ac0000;text-transform:uppercase;">FARAON DISKONTI</div></div>
      <div style="float:right;width:48%;text-align:right;font-size:12px;color:#5b544d;">
        <strong style="display:block;font-size:13px;color:#1b1b1b;margin-bottom:4px;">STR Diskont pića Faraon PS</strong>
        Karlovački put 1<br/>21132 Petrovaradin<br/>T: 060 55 22 500<br/>E: info@faraondiskonti.rs<br/>PIB: 104032720
      </div>
      <div style="clear:both;"></div>
    </div>
    <div style="background:#ac0000;color:#ffffff;padding:22px 32px;text-align:center;">
      <div style="font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;opacity:0.9;">Nova porudžbina — Plaćanje karticom ✓</div>
      <h1 style="margin:10px 0 0;font-size:28px;font-weight:900;">Primljena je nova porudžbina</h1>
    </div>
    <div style="background:#FFB200;color:#1b1b1b;padding:15px 32px;text-align:center;font-size:20px;font-weight:800;">Porudžbina #${orderNumber}</div>
    <div style="padding:32px;">
      <div style="margin-bottom:18px;padding:16px 20px;border:2px solid #d4edda;border-radius:8px;background:#f0fff4;">
        <strong style="color:#2e7d32;">Plaćanje karticom potvrđeno</strong><br/>
        ${vposOrderId ? `<span style="font-size:13px;color:#5b544d;">VPOS OrderID: ${vposOrderId}${authorcode ? ` | Auth code: ${authorcode}` : ""}</span>` : ""}
      </div>
      <div style="margin-bottom:24px;padding:20px 22px;border:2px solid #f0d28a;border-radius:8px;background:#fff8e7;">
        <h2 style="color:#ac0000;font-size:18px;border-bottom:2px solid #FFB200;padding-bottom:8px;margin:0 0 16px;font-weight:800;">Podaci o kupcu</h2>
        <p style="margin:6px 0;"><strong>Ime i prezime:</strong> ${pending.fullName}</p>
        <p style="margin:6px 0;"><strong>Email:</strong> ${pending.email}</p>
        <p style="margin:6px 0;"><strong>Telefon:</strong> ${pending.phone}</p>
        <p style="margin:6px 0;"><strong>Adresa:</strong> ${pending.address}, ${pending.postalCode} ${pending.city}</p>
        ${pending.pib?.trim() ? `<p style="margin:6px 0;"><strong>PIB:</strong> ${pending.pib.trim()}</p>` : ""}
        ${pending.mb?.trim() ? `<p style="margin:6px 0;"><strong>Matični broj:</strong> ${pending.mb.trim()}</p>` : ""}
        <p style="margin:6px 0;"><strong>Napomena:</strong> ${pending.note || "-"}</p>
      </div>
      <div style="margin-bottom:18px;">
        <h2 style="color:#ac0000;font-size:18px;border-bottom:2px solid #FFB200;padding-bottom:8px;margin:0 0 16px;font-weight:800;">Sadržaj porudžbine</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:10px;">
          <thead>
            <tr style="background:#ac0000;color:#fff;">
              <th style="padding:12px;text-align:left;font-size:14px;">Šifra</th>
              <th style="padding:12px;text-align:left;font-size:14px;">Proizvod</th>
              <th style="padding:12px;text-align:center;font-size:14px;">Količina</th>
              <th style="padding:12px;text-align:right;font-size:14px;">Cena</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <table style="width:100%;margin-top:20px;border-collapse:collapse;">
          <tr style="border-top:2px solid #ac0000;">
            <td style="padding:15px 10px;text-align:right;font-size:21px;font-weight:800;color:#ac0000;">UKUPNO ZA NAPLATU:</td>
            <td style="padding:15px 10px;text-align:right;font-size:21px;font-weight:800;color:#ac0000;white-space:nowrap;">${fmtRSD(pending.total)} RSD</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`;

  const customerDeliveryRowsHtml = [
    `<tr>
      <td style="padding:10px 8px;${hasExtraWeight ? "border-bottom:1px solid #e5d9ca;" : ""}font-size:13px;font-weight:700;color:#1b1b1b;">Dostava ${pending.city}</td>
      <td style="padding:10px 8px;${hasExtraWeight ? "border-bottom:1px solid #e5d9ca;" : ""}font-size:13px;text-align:center;color:#1b1b1b;">1</td>
      <td style="padding:10px 8px;${hasExtraWeight ? "border-bottom:1px solid #e5d9ca;" : ""}font-size:13px;text-align:right;color:#1b1b1b;">${fmtRSD(pending.shippingBasePrice)} RSD</td>
    </tr>`,
    ...(hasExtraWeight
      ? [`<tr>
      <td style="padding:10px 8px;font-size:13px;font-weight:700;color:#1b1b1b;">Dostava dodatni kg (${pending.extraWeightShipments} × ${fmtRSD(pending.extraWeightUnitPrice)} RSD)</td>
      <td style="padding:10px 8px;font-size:13px;text-align:center;color:#1b1b1b;">${pending.extraWeightShipments}</td>
      <td style="padding:10px 8px;font-size:13px;text-align:right;color:#1b1b1b;">${fmtRSD(pending.extraWeightTotalPrice)} RSD</td>
    </tr>`]
      : []),
  ].join("");

  const customerHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Potvrda porudžbine</title>
  <style>
    p{font-size:16px;line-height:1.6;margin:0;}
    h1{font-size:26px;line-height:1.15;}
    h2{font-size:18px;}
    @media screen and (max-width:600px){
      p{font-size:14px!important;}
      h1{font-size:22px!important;}
      h2{font-size:15px!important;}
      .em-banner{font-size:16px!important;}
      .em-total td{font-size:16px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:12px;background:#f5f1ea;font-family:Arial,sans-serif;color:#1b1b1b;line-height:1.6;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5d9ca;">
    <div style="padding:16px;background:#f8f5ef;border-bottom:3px solid #ac0000;">
      <p style="margin:0;font-size:17px;font-weight:900;letter-spacing:0.04em;color:#ac0000;text-transform:uppercase;">FARAON DISKONTI</p>
      <p style="margin:4px 0 0;font-size:11px;line-height:1.6;color:#5b544d;">STR Diskont pića Faraon PS · Karlovački put 1 · 21132 Petrovaradin<br/>T: 060 55 22 500 · E: info@faraondiskonti.rs · PIB: 104032720</p>
    </div>
    <div style="background:#ac0000;color:#ffffff;padding:20px 16px;text-align:center;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;opacity:0.9;">Potvrda porudžbine</div>
      <h1 style="margin:8px 0 0;font-size:26px;line-height:1.15;font-weight:900;">Hvala na kupovini!</h1>
    </div>
    <div class="em-banner" style="background:#FFB200;color:#1b1b1b;padding:14px 16px;text-align:center;font-size:18px;font-weight:800;">Porudžbina #${orderNumber}</div>
    <div style="padding:20px 16px;">
      <p style="margin:0 0 16px;color:#1b1b1b;">Vaša porudžbina je uspešno primljena i plaćanje karticom je potvrđeno.</p>
      <div style="margin-bottom:20px;padding:16px;border:2px solid #ac0000;border-radius:8px;background:#fffaf6;">
        <h2 style="color:#ac0000;border-bottom:2px solid #FFB200;padding-bottom:8px;margin:0 0 12px;font-weight:800;">Način plaćanja</h2>
        <p style="font-weight:700;color:#1b1b1b;">Plaćanje karticama</p>
        <p style="margin-top:8px;color:#5b544d;">Uplata je uspešno izvršena.</p>
      </div>
      <h2 style="color:#ac0000;border-bottom:2px solid #FFB200;padding-bottom:8px;margin:0 0 12px;font-weight:800;">Vaša porudžbina</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#ac0000;color:#fff;">
            <th style="padding:10px 8px;text-align:left;font-size:13px;">Proizvod</th>
            <th style="padding:10px 8px;text-align:center;font-size:13px;">Kol.</th>
            <th style="padding:10px 8px;text-align:right;font-size:13px;">Cena</th>
          </tr>
        </thead>
        <tbody>${[
          ...pending.orderItems.map(
            (item) => `<tr>
            <td style="padding:10px 8px;border-bottom:1px solid #e5d9ca;font-size:13px;font-weight:700;color:#1b1b1b;">${item.name}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #e5d9ca;font-size:13px;text-align:center;color:#1b1b1b;">${item.quantity}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #e5d9ca;font-size:13px;text-align:right;color:#1b1b1b;">${fmtRSD(item.price)} RSD</td>
          </tr>`,
          ),
          customerDeliveryRowsHtml,
        ].join("")}</tbody>
      </table>
      <table class="em-total" style="width:100%;margin-top:16px;border-collapse:collapse;">
        <tr style="border-top:2px solid #ac0000;">
          <td style="padding:12px 8px;text-align:right;font-size:18px;font-weight:800;color:#ac0000;">UKUPNO:</td>
          <td style="padding:12px 8px;text-align:right;font-size:18px;font-weight:800;color:#ac0000;">${fmtRSD(pending.total)} RSD</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:8px;text-align:right;font-size:11px;color:#5b544d;font-style:italic;">* PDV uračunat u cenu${pending.totalWeight ? ` · Težina pošiljke: ${pending.totalWeight}` : ""}</td>
        </tr>
      </table>
    </div>
    <div style="background:#8c0000;padding:20px 16px;text-align:center;color:#fff;">
      <p style="margin:0 0 6px;font-size:15px;font-weight:800;">Srdačan pozdrav,</p>
      <p style="margin:0 0 6px;font-size:14px;font-weight:700;">Faraon diskonti</p>
      <p style="margin:0 0 4px;font-size:12px;opacity:0.92;"><a href="https://www.faraondiskonti.rs" style="color:#fff;text-decoration:underline;">www.faraondiskonti.rs</a></p>
      <p style="margin:0 0 8px;font-size:12px;opacity:0.92;">webshop@faraondiskonti.rs | 060 55 22 500</p>
      <p style="margin:0;font-size:12px;"><a href="https://www.facebook.com/diskonti.faraon/?locale=sr_RS" style="color:#fff;text-decoration:none;">Facebook</a> &nbsp;&bull;&nbsp; <a href="https://www.instagram.com/diskonti.faraon/" style="color:#fff;text-decoration:none;">Instagram</a></p>
    </div>
  </div>
</body>
</html>`;

  const ownerAttachments = warrantPdf ? [warrantPdf] : undefined;

  const [ownerResult, customerResult] = await Promise.allSettled([
    resend.emails.send({
      from: emailFrom,
      to: storeEmail,
      subject: `Porudžbina #${orderNumber} (kartica) - ${pending.fullName}`,
      html: ownerHtml,
      attachments: ownerAttachments,
    }),
    resend.emails.send({
      from: emailFrom,
      to: pending.email,
      subject: `Potvrda porudžbine #${orderNumber} — Faraon Diskonti`,
      html: customerHtml,
    }),
  ]);

  if (ownerResult.status === "rejected" || (ownerResult.status === "fulfilled" && ownerResult.value.error)) {
    console.error("[checkout-emails] Owner email failed:", ownerResult);
  }
  if (customerResult.status === "rejected" || (customerResult.status === "fulfilled" && customerResult.value.error)) {
    console.error("[checkout-emails] Customer email failed:", customerResult);
  }
};
