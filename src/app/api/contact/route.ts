import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
const contactRecipientEmail =
  process.env.CONTACT_RECIPIENT_EMAIL ?? emailFrom;

const contactSchema = z.object({
  fullName: z.string().min(1),
  email: z.email(),
  subject: z.string().min(1),
  reason: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  const { fullName, email, subject, reason, message } = parsed.data;

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nova kontakt poruka</title>
  </head>
  <body style="margin:0;padding:24px 12px;background:#f5f1ea;font-family:Arial,sans-serif;color:#1b1b1b;line-height:1.6;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5d9ca;">
      <div style="padding:24px 30px;background:#f8f5ef;border-bottom:3px solid #ac0000;overflow:hidden;">
        <div style="float:left;width:48%;">
          <div style="font-size:18px;line-height:1.1;font-weight:900;letter-spacing:0.04em;color:#ac0000;text-transform:uppercase;">FARAON DISKONTI</div>
        </div>
        <div style="float:right;width:48%;text-align:right;font-size:12px;line-height:1.65;color:#5b544d;">
          <strong style="display:block;font-size:13px;color:#1b1b1b;margin-bottom:4px;">STR Diskont pića Faraon PS</strong>
          Karlovački put 1<br />21132 Petrovaradin<br />T: 060 22 33 400<br />E: info@faraondiskonti.rs
        </div>
        <div style="clear:both;"></div>
      </div>
      <div style="background:#ac0000;color:#ffffff;padding:22px 32px;text-align:center;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;opacity:0.9;">Kontakt forma</div>
        <h1 style="margin:10px 0 0;font-size:28px;line-height:1.15;font-weight:900;">Nova kontakt poruka</h1>
      </div>
      <div style="background:#FFB200;color:#1b1b1b;padding:14px 32px;text-align:center;font-size:16px;font-weight:800;">Razlog: ${reason}</div>
      <div style="padding:32px;">
        <div style="margin-bottom:24px;padding:20px 22px;border:2px solid #f0d28a;border-radius:8px;background:#fff8e7;">
          <h2 style="color:#ac0000;font-size:17px;border-bottom:2px solid #FFB200;padding-bottom:8px;margin:0 0 16px;font-weight:800;">Podaci o pošiljaocu</h2>
          <p style="margin:6px 0;"><strong>Ime i prezime:</strong> ${fullName}</p>
          <p style="margin:6px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#ac0000;">${email}</a></p>
          <p style="margin:6px 0;"><strong>Naslov:</strong> ${subject}</p>
        </div>
        <div style="padding:20px 22px;border:2px solid #e5d9ca;border-radius:8px;background:#fafaf8;">
          <h2 style="color:#ac0000;font-size:17px;border-bottom:2px solid #FFB200;padding-bottom:8px;margin:0 0 16px;font-weight:800;">Poruka</h2>
          <p style="margin:0;font-size:15px;white-space:pre-wrap;color:#1b1b1b;">${message}</p>
        </div>
      </div>
      <div style="background:#8c0000;padding:24px 32px;text-align:center;color:#fff;">
        <p style="margin:0 0 8px;font-size:17px;font-weight:800;">Srdačan pozdrav,</p>
        <p style="margin:0 0 8px;font-size:15px;font-weight:700;">STR Diskont pića Faraon PS</p>
        <p style="margin:0;font-size:13px;opacity:0.92;">info@faraondiskonti.rs | 060 22 33 400</p>
      </div>
    </div>
  </body>
</html>`;

  const result = await resend.emails.send({
    from: emailFrom,
    to: contactRecipientEmail,
    replyTo: email,
    subject: `[KONTAKT] ${subject} – ${fullName}`,
    html,
  });

  if (result.error) {
    console.error("Contact email send failed:", result.error);
    return NextResponse.json(
      { error: "Slanje poruke nije uspelo." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
