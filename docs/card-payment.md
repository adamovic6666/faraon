# Card Payment — UniCredit VPOS Integration

## Overview

Card payment is handled via **UniCredit Bank Serbia** using the **SIA VPOS Redirect** integration (spec: Merchant Integration VPOS REDIRECT_2.6.0 Nexi). The customer is redirected to the bank's hosted payment page, enters their card details there, and is redirected back when done.

Relevant files:

- [src/lib/vpos.ts](../src/lib/vpos.ts) — MAC signing, param building
- [src/lib/vpos-pending.ts](../src/lib/vpos-pending.ts) — in-memory pending order store
- [src/app/api/checkout/init-payment/route.ts](../src/app/api/checkout/init-payment/route.ts) — initiates payment
- [src/app/api/checkout/payment-callback/route.ts](../src/app/api/checkout/payment-callback/route.ts) — server-to-server confirmation
- [src/app/api/checkout/payment-return/route.ts](../src/app/api/checkout/payment-return/route.ts) — customer redirect after payment
- [src/lib/checkout-emails.ts](../src/lib/checkout-emails.ts) — confirmation emails

---

## Full Payment Flow

```
1. Customer selects "Card Payment" on checkout and submits the form
        ↓
2. POST /api/checkout/init-payment
   - Generates unique reqrefnum (32-char alphanumeric)
   - Saves full order data in memory keyed by reqrefnum (TTL: 30 min)
   - Builds VPOS params and signs them with MAC (SHA-1)
   - Returns vposUrl + params to the client
        ↓
3. Client creates a hidden HTML form and submits it via POST to the VPOS URL
   (customer leaves the site and lands on the bank's payment page)
        ↓
4. Customer enters card details on the UniCredit/SIA hosted page
        ↓
5a. [Server-to-server] Bank POSTs to /api/checkout/payment-callback (URLMS)
   - Verifies store ID and MAC signature
   - If ESITO == "OK": creates order, submits delivery, sends emails
   - Returns plain text "OK" to the bank

5b. [Customer redirect] Bank redirects customer GET to /api/checkout/payment-return (URLDone)
   - Checks RESULT == "00" (success)
   - If the pending order still exists (URLMS didn't fire yet): creates order, sends emails
   - Redirects to /korpa/checkout/uspesno with order details
```

Steps 5a and 5b can happen in either order. The pending order store prevents double-processing — whichever arrives first claims and clears the record.

> **Note:** In the test environment the URLMS callback does not fire, so 5b (payment-return) acts as the primary order creation path.

---

## Key Configuration (env vars)

| Variable | Description |
|---|---|
| `VPOS_STORE_ID` | Merchant store ID — format `IGxxxxxx`, e.g. `80729IG00034901` |
| `VPOS_SECRET_KEY_START` | MAC signing secret for the initial payment request |
| `VPOS_SECRET_KEY_RESULT_API` | MAC signing secret for verifying the callback |
| `VPOS_URL` | VPOS redirect URL (test: `https://virtualpostest.sia.eu/vpos/payments/main?PAGE=LAND`) |

---

## MAC Signing

All requests to and from the VPOS are authenticated with a SHA-1 HMAC signature called **MAC**. The field order matters and is fixed by the bank's specification.

### Outgoing request (init-payment)

Fields concatenated in this exact order before hashing:

```
URLMS + URLDONE + ORDERID + SHOPID + AMOUNT + CURRENCY + ACCOUNTINGMODE + AUTHORMODE
```

Secret key: `VPOS_SECRET_KEY_START`

### Incoming callback (payment-callback)

Fields concatenated in this exact order:

```
IDNEGOZIO + NUMORD + ORDERID + IMPORTO + VALUTA + ESITO + AUT
```

Secret key: `VPOS_SECRET_KEY_RESULT_API`

Implementation: [src/lib/vpos.ts](../src/lib/vpos.ts)

---

## VPOS Parameters

Key parameters sent in the redirect form POST:

| Parameter | Value | Notes |
|---|---|---|
| `SHOPID` | `VPOS_STORE_ID` | Merchant identifier |
| `ORDERID` | Backend order reference | Passed back by bank in callback |
| `NUMORD` | `reqrefnum` | Our internal 32-char key; used to link callback to pending order |
| `AMOUNT` | price × 100 | In paras (RSD minor unit) |
| `CURRENCY` | `941` | ISO code for RSD |
| `LANGUAGE` | `SR` | Serbian |
| `ACCOUNTINGMODE` | `I` | Immediate accounting |
| `AUTHORMODE` | `I` | Immediate authorization |
| `URLMS` | `/api/checkout/payment-callback` | Server-to-server notification |
| `URLDONE` | `/api/checkout/payment-return` | Customer redirect on success |
| `URLBACK` | `/korpa/checkout?payment_cancelled=1` | Customer redirect on cancel |

---

## Pending Order Store

Because the order must only be created once, but two paths (URLMS + URLDone) can both attempt creation, a short-lived in-memory store holds the full order data:

- **Key:** `reqrefnum`
- **Value:** full checkout payload (items, customer, delivery details)
- **TTL:** 30 minutes
- **On claim:** record is immediately cleared to prevent double-processing

Implementation: [src/lib/vpos-pending.ts](../src/lib/vpos-pending.ts)

> **Production note:** This store is in-memory (single process). If the app runs across multiple instances, pending orders need to be moved to a shared store (e.g. Redis/Upstash).

---

## After Successful Payment

Regardless of which path (5a or 5b) creates the order, the following always happens:

1. Order created in the Faraon backend (`POST /api/v1/orders`)
2. Delivery order submitted to Dostava321
3. Warrant PDF fetched (if the backend returns one)
4. Confirmation emails sent to both the store and the customer (via Resend)
   - Includes VPOS Order ID, authorization code, item list, and delivery details

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Customer cancels on VPOS page | Redirected to `/korpa/checkout?payment_cancelled=1` |
| Payment fails / RESULT != "00" | Redirected to `/korpa/checkout?payment_error=1` |
| Invalid MAC in callback | Request rejected, order not created |
| URLMS succeeds but order creation fails | Alert email sent to store; error logged |
| Pending order expired (>30 min) | Order cannot be created; customer sees error |

---

## Test vs Production

Switch `VPOS_URL` in `.env.local`:

- **Test:** `https://virtualpostest.sia.eu/vpos/payments/main?PAGE=LAND`
- **Production:** provided by UniCredit/SIA upon go-live approval

No code changes required — only the env var.
