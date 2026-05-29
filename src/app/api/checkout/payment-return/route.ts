/**
 * URLDone — Customer return URL after VPOS payment.
 *
 * The bank redirects the customer here (GET) after the payment page,
 * regardless of outcome. Result parameters are appended to this URL.
 *
 * On success  → creates the Drupal order + 321 delivery (if not already done
 *               by URLMS/payment-callback), then redirects to /korpa/checkout/uspesno
 * On failure  → redirect to /korpa/checkout?payment_error=1
 *
 * Order creation happens here as the primary path because the SIA VPOS test
 * environment does not call URLMS at all. In production, if URLMS fires first
 * and clears the pending record, this route safely skips creation.
 *
 * Ref: Merchant Integration VPOS REDIRECT_2.6.0._Nexi — URLDone section
 */

import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/vpos";
import { getPendingOrder, clearPendingOrder } from "@/lib/vpos-pending";
import { createOrder } from "@/lib/api/faraon";

/**
 * SIA VPOS URLDone result code for success.
 * URLDone uses RESULT=00 (English names), unlike URLMS which uses ESITO (Italian names).
 * Confirmed from live VPOS test server response.
 */
const RESULT_OK = "00";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const baseUrl = getBaseUrl();

  // Debug: log all params received from VPOS URLDone
  const allParams: Record<string, string> = {};
  searchParams.forEach((value, key) => { allParams[key] = value; });
  console.log("[payment-return] VPOS params:", JSON.stringify(allParams));

  // URLDone uses English field names: RESULT (not ESITO), ORDERID = our reqrefnum
  const result = searchParams.get("RESULT")?.trim() ?? "";
  const reqrefnum = searchParams.get("ORDERID")?.trim() ?? "";
  const transactionId = searchParams.get("TRANSACTIONID")?.trim() ?? "";

  if (result !== RESULT_OK) {
    // Payment failed or was declined — send back to checkout with error flag
    return NextResponse.redirect(
      `${baseUrl}/korpa/checkout?payment_error=1`,
      { status: 302 },
    );
  }

  // ---------------------------------------------------------------------------
  // Attempt order creation if URLMS hasn't already done it.
  // getPendingOrder returns null when payment-callback already processed + cleared it.
  // ---------------------------------------------------------------------------
  let orderId = "";
  let orderNumber = transactionId; // fallback shown to user if Drupal call fails

  const pending = getPendingOrder(reqrefnum);
  if (pending) {
    // Claim the record immediately to prevent payment-callback from double-creating
    clearPendingOrder(reqrefnum);

    try {
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
          email: pending.email,
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

      if (orderResult.ok) {
        orderId = orderResult.data.orderId;
        orderNumber = orderResult.data.orderNumber;
        console.info(
          `[payment-return] Order #${orderNumber} created for reqrefnum ${reqrefnum}`,
        );

        // Send delivery order to 321
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
              "[payment-return] 321 delivery order failed:",
              deliveryResponse.status,
            );
          }
        } catch (deliveryErr) {
          console.warn("[payment-return] 321 delivery order error:", deliveryErr);
        }
      } else {
        console.error(
          "[payment-return] createOrder failed for reqrefnum:",
          reqrefnum,
          orderResult.error,
        );
      }
    } catch (err) {
      console.error("[payment-return] Order creation error:", err);
    }
  } else {
    console.info(
      `[payment-return] Pending order not found for reqrefnum ${reqrefnum} — likely already processed by URLMS.`,
    );
  }

  const successParams = new URLSearchParams({ paymentMethod: "card_payment" });
  successParams.set("order", orderNumber);
  if (orderId) successParams.set("orderId", orderId);
  if (reqrefnum) successParams.set("ref", reqrefnum);

  return NextResponse.redirect(
    `${baseUrl}/korpa/checkout/uspesno?${successParams.toString()}`,
    { status: 302 },
  );
}
