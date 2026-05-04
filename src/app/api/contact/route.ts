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

  const html = `
    <h2>Nova kontakt poruka</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      <tr><td><strong>Ime i prezime:</strong></td><td>${fullName}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
      <tr><td><strong>Razlog:</strong></td><td>${reason}</td></tr>
      <tr><td><strong>Naslov:</strong></td><td>${subject}</td></tr>
    </table>
    <br />
    <p><strong>Poruka:</strong></p>
    <p style="white-space:pre-wrap;">${message}</p>
  `;

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
