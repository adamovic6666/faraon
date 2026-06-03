/**
 * URLMS — Server-to-server payment notification from SIA VPOS.
 *
 * The bank POSTs this endpoint after each payment attempt (success or failure).
 * Must respond with plain text "OK" to acknowledge receipt.
 *
 * On successful payment:
 *   1. Verifies the MAC signature
 *   2. Retrieves pending order data (keyed by reqrefnum)
 *   3. Creates the order in the backend
 *   4. Sends confirmation emails via Resend
 *
 * Ref: Merchant Integration VPOS REDIRECT_2.6.0._Nexi — URLMS section
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyCallbackMac, getStoreId } from "@/lib/vpos";
import { getPendingOrder, clearPendingOrder } from "@/lib/vpos-pending";
import { createOrder } from "@/lib/api/faraon";
import { sendCardPaymentEmails } from "@/lib/checkout-emails";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
const storeEmail = process.env.ORDER_RECIPIENT_EMAIL ?? emailFrom;

/** SIA VPOS result code for a successful transaction. */
const RESULT_OK = "OK";

const ok = () =>
  new NextResponse("OK", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });

export async function POST(request: NextRequest) {
  let reqrefnum = "";

  try {
    // URLMS body is application/x-www-form-urlencoded
    const formData = await request.formData();

    const get = (key: string): string => {
      const val = formData.get(key);
      return typeof val === "string" ? val.trim() : "";
    };

    // Debug: log all fields received from VPOS URLMS
    const allFields: Record<string, string> = {};
    formData.forEach((value, key) => { if (typeof value === "string") allFields[key] = value; });
    console.log("[payment-callback] URLMS fields:", JSON.stringify(allFields));

    reqrefnum = get("NUMORD");
    const storeid = get("IDNEGOZIO");
    const orderid = get("ORDERID");
    const result = get("ESITO");
    const amount = get("IMPORTO");
    const valuta = get("VALUTA");
    const authorcode = get("AUT");
    const mac = get("MAC");

    // -----------------------------------------------------------------------
    // 1. Validate required fields
    // -----------------------------------------------------------------------
    if (!reqrefnum || !storeid || !result || !mac) {
      console.error("[payment-callback] Missing required URLMS fields", {
        NUMORD: reqrefnum,
        IDNEGOZIO: storeid,
        ESITO: result,
        MAC: mac,
      });
      // Still return OK to avoid the bank flagging repeated errors
      return ok();
    }

    // -----------------------------------------------------------------------
    // 2. Verify Store ID matches our configuration
    // -----------------------------------------------------------------------
    if (storeid !== getStoreId()) {
      console.error("[payment-callback] Store ID mismatch", { storeid });
      return ok();
    }

    // -----------------------------------------------------------------------
    // 3. Verify MAC
    // -----------------------------------------------------------------------
    const macValid = verifyCallbackMac({
      IDNEGOZIO: storeid,
      NUMORD: reqrefnum,
      ORDERID: orderid,
      IMPORTO: amount,
      VALUTA: valuta,
      ESITO: result,
      AUT: authorcode,
      MAC: mac,
    });

    if (!macValid) {
      console.error("[payment-callback] Invalid MAC for reqrefnum:", reqrefnum);
      return ok();
    }

    // -----------------------------------------------------------------------
    // 4. Only process successful transactions
    // -----------------------------------------------------------------------
    if (result !== RESULT_OK) {
      console.info(
        `[payment-callback] Payment failed/declined for reqrefnum ${reqrefnum}, result: ${result}`,
      );
      clearPendingOrder(reqrefnum);
      return ok();
    }

    // -----------------------------------------------------------------------
    // 5. Retrieve pending order data
    // -----------------------------------------------------------------------
    const pending = getPendingOrder(reqrefnum);

    if (!pending) {
      console.error(
        "[payment-callback] No pending order found for reqrefnum:",
        reqrefnum,
        "— may have already been processed or expired.",
      );
      return ok();
    }

    // -----------------------------------------------------------------------
    // 6. Create order in backend
    // -----------------------------------------------------------------------
    const nameParts = pending.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const shippingAddress = {
      country_code: "RS",
      address_line1: pending.address,
      locality: pending.city,
      postal_code: pending.postalCode,
      given_name: firstName,
      family_name: lastName,
      phone_number: pending.phone,
      ...(pending.pib?.trim() ? { pib: pending.pib.trim() } : {}),
      ...(pending.mb?.trim() ? { mb: pending.mb.trim() } : {}),
    };

    const backendOrderData = {
      customer: {
        payment_method: "personal" as const,
        cenovnik_term_id: pending.cenovnikTermId,
        shipping_price: pending.shippingPrice,
        email: pending.email,
        notes: pending.note.trim(),
        billing_address: {
          country_code: "RS",
          address_line1: pending.address,
          locality: pending.city,
          postal_code: pending.postalCode,
          given_name: firstName,
          family_name: lastName,
        },
        shipping_address: shippingAddress,
      },
      products: pending.orderItems.map((item) => ({
        product_id: item.productCode,
        quantity: item.quantity,
      })),
    };

    const orderResult = await createOrder(backendOrderData);

    if (!orderResult.ok) {
      console.error(
        "[payment-callback] createOrder failed for reqrefnum:",
        reqrefnum,
        orderResult.error,
        orderResult.details,
      );
      // Payment succeeded but order creation failed — log and alert via email.
      // Do NOT clear pending so it can be investigated.
      void sendFailureAlert(reqrefnum, orderid, pending.email, pending.fullName);
      return ok();
    }

    const { orderId: newOrderId, orderNumber } = orderResult.data;

    // Mark as processed
    clearPendingOrder(reqrefnum);

    // -----------------------------------------------------------------------
    // 8. Submit 321 delivery order
    // -----------------------------------------------------------------------
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/$/, "") ?? process.env.BASE_URL?.trim().replace(/\/$/, "") ?? "";

    try {
      const deliveryResponse = await fetch(
        `${baseUrl}/api/checkout/delivery-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            addressId: pending.deliveryAddressId,
            addressNumber: pending.deliveryAddressNumber,
            customerPhoneNumber: pending.phone,
            comment: pending.deliveryComment,
          }),
        },
      );

      if (!deliveryResponse.ok) {
        console.warn(
          "[payment-callback] 321 delivery order failed:",
          deliveryResponse.status,
        );
      }
    } catch (deliveryErr) {
      console.warn("[payment-callback] 321 delivery order error:", deliveryErr);
    }

    // -----------------------------------------------------------------------
    // 9. Fetch warrant PDF (if available)
    // -----------------------------------------------------------------------
    let warrantPdf: import("@/lib/checkout-emails").WarrantPdfAttachment | undefined;
    if (orderResult.data.warrant?.url) {
      try {
        const warrantRes = await fetch(orderResult.data.warrant.url);
        if (warrantRes.ok) {
          warrantPdf = {
            filename: orderResult.data.warrant.fileName,
            content: Buffer.from(await warrantRes.arrayBuffer()),
            content_type: "application/pdf",
          };
        }
      } catch (warrantErr) {
        console.warn("[payment-callback] Failed to fetch warrant PDF:", warrantErr);
      }
    }

    // -----------------------------------------------------------------------
    // 10. Send confirmation emails
    // -----------------------------------------------------------------------
    await sendCardPaymentEmails({
      orderNumber,
      orderId: newOrderId,
      vposOrderId: orderid,
      authorcode,
      pending,
      warrantPdf,
    });

    console.info(
      `[payment-callback] Order #${orderNumber} created for reqrefnum ${reqrefnum}`,
    );

    return ok();
  } catch (error) {
    console.error("[payment-callback] Unhandled error:", error);
    // Always return OK to prevent bank retries on our internal errors
    return ok();
  }
}


// ---------------------------------------------------------------------------
// Failure alert (card charged but order creation failed — payment-callback only)
// ---------------------------------------------------------------------------

const sendFailureAlert = async (
  reqrefnum: string,
  vposOrderId: string,
  customerEmail: string,
  customerName: string,
) => {
  try {
    await resend.emails.send({
      from: emailFrom,
      to: storeEmail,
      subject: `⚠️ VPOS plaćanje OK ali kreiranje porudžbine neuspešno`,
      html: `<p>Plaćanje karticom je prošlo ali kreiranje porudžbine u sistemu nije uspelo.</p>
<p><strong>reqrefnum:</strong> ${reqrefnum}<br/>
<strong>VPOS OrderID:</strong> ${vposOrderId}<br/>
<strong>Kupac:</strong> ${customerName} (${customerEmail})</p>
<p>Molimo ručno kreirajte porudžbinu.</p>`,
    });
  } catch (err) {
    console.error("[payment-callback] Failure alert email failed:", err);
  }
};
