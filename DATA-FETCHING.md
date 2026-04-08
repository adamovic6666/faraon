# Data Fetching & Architecture

Patterns used in this project for fetching data, handling search, and sending orders to the backend.

---

## Overview

The frontend communicates with an **external REST API** (`BASE_URL`). There is no ORM or database on the Next.js side. All data-fetching happens via `fetch()`, protected by an `API_HASH` query parameter.

**Environment variables:**

```
BASE_URL=https://backend.kosmospromet.com       # Server-only
NEXT_PUBLIC_API_URL=https://backend.kosmospromet.com  # Available in browser
API_HASH=...                                    # Server-only, appended as ?cc=
NEXT_PUBLIC_SITE_URL=https://www.kosmospromet.com/
```

---

## 1. Homepage

**File:** `app/page.tsx`  
**Type:** Server Component (SSR + ISR)

Fetches all products, then slices the first 6 for display.

```ts
const res = await fetch(
  `${process.env.BASE_URL}/api/v1/list-products?data=all&cc=${process.env.API_HASH}`,
  { next: { revalidate: 3600 } }, // Rebuild at most once per hour
);
const data = await res.json();
```

- `data=all` returns every product
- Cache is set to 1 hour — the page won't hit the backend on every request
- The `<Products />` component receives the array and shows `.slice(0, 6)`

---

## 2. Category / Product Listing Pages

**File:** `app/(routes)/prodavnica/[...slug]/page.tsx`  
**Type:** Server Component (ISR, 60s revalidation)

URL structure:

```
/prodavnica                        → all products  (data=prodavnica)
/prodavnica/regulatori             → category      (data=regulatori)
/prodavnica/regulatori/za-kukuruz  → subcategory   (data=regulatori/za-kukuruz)
```

The `[...slug]` catch-all is joined and passed directly as the `data` query param:

```ts
const getProductsData = async (pathname: string) => {
  const res = await fetch(
    `${process.env.BASE_URL}/api/v1/list-products?data=${pathname}&cc=${process.env.API_HASH}`,
    { next: { revalidate: 60 } },
  );
  return res.json();
};

// In page component:
const slugPath = params.slug?.join("/") ?? "prodavnica";
const data = await getProductsData(slugPath);
```

**Response shape:**

```ts
{
  products: Product[],
  parent: {
    metatags: { title: string; description: string },
    description?: string
  },
  breadcrumbs: Array<{ name: string; link: string }>
}
```

There is no pagination — the backend returns all products for the given category at once.

---

## 3. Single Product Page

**File:** `app/(routes)/product/[slug]/page.tsx`  
**Type:** Server Component, uses React `cache()`

`cache()` deduplicates the fetch — if `generateMetadata` and the page component both call `getProductData(slug)`, the network request fires only once.

```ts
import { cache } from "react";

const getProductData = cache(async (slug: string): Promise<ProductDetail> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/get-product?p=/product/${slug}&cc=${process.env.API_HASH}`,
    { redirect: "manual" },
  );

  if (response.status === 301 || response.status === 302)
    redirect("/prodavnica");
  if (response.status === 404) notFound();
  if (response.status === 403) throw new Error("Access forbidden");

  return response.json();
});
```

**`redirect: "manual"`** is important — without it, `fetch` would silently follow the backend's redirects. Intercepting them manually lets you send the user to the right Next.js page instead.

**Response shape:**

```ts
{
  title: string,
  description: string,
  categories: string,
  main_photo: string,
  is_new: string,
  photo_gallery: { thumb: string[]; orig: string[] },
  product_code: string,
  metatag: { title: string; description: string },
  similar_products?: Product[],
  cena: string,           // "1250.00"
  akcijska_cena?: string, // sale price
  documentation?: string,
  breadcrumbs: { name: string; link: string }[],
  is_available: boolean
}
```

---

## 4. Search

**Files:**

- `app/utils/search.ts` — core fetch logic
- `app/_components/ui/SearchDropdown.tsx` — real-time dropdown UI
- `app/(routes)/prodavnica/search/page.tsx` — full results page

### How it works

Two modes, one endpoint:

| Mode         | Trigger                    | Extra param      |
| ------------ | -------------------------- | ---------------- |
| Dropdown     | User types in header input | `&type=dropdown` |
| Results page | Form submit / Enter        | —                |

```ts
// app/utils/search.ts
export const searchProducts = cache(
  async (query: string, isDropdown = false): Promise<SearchResult[]> => {
    if (query.length < 2) return [];

    const url =
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/search` +
      `?q=${encodeURIComponent(query)}` +
      `&cc=${encodedHash}` +
      (isDropdown ? "&type=dropdown" : "");

    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();
    return data || [];
  },
);
```

### Dropdown behaviour (client-side)

- **Debounce:** 400 ms — fires after user stops typing
- **Minimum length:** 2 characters
- **Keyboard:** Arrow Up/Down to navigate, Enter to submit, Escape to close

```ts
// Debounce utility (app/utils/search.ts)
export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number,
) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
```

### Results page

URL: `/prodavnica/search?q=kukuruz`

Server component — reads `searchParams.q`, calls `searchProducts(query)`, renders the list. No client-side state needed.

---

## 5. Cart

**File:** `app/_context/CartContext.tsx`

Cart lives entirely in the browser — no backend involved until checkout.

```ts
interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string | number) => boolean;
}
```

- Persisted to `localStorage` under key `kosmos-promet-cart`
- Syncs across tabs via the `storage` event
- `cart.total` and `cart.itemCount` are derived on every state update

---

## 6. Creating an Order

### Full flow

```
CheckoutForm  →  POST /api/checkout  →  backend POST /api/v1/orders
                      │
                      ├── generate PDF receipt (pdf-lib)
                      ├── email owner (HTML + PDF) via Resend
                      └── email customer (HTML confirmation) via Resend
```

### Step 1 — Frontend sends to Next.js API route

**File:** `app/(routes)/korpa/checkout/_components/CheckoutForm.tsx`

```ts
const response = await fetch("/api/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fullName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    postalCode: string,
    paymentMethod: "bank_transfer" | "cash_on_delivery",
    note?: string,
    orderItems: Array<{
      name: string,
      productCode: string,
      quantity: number,
      price: string,   // unit price
      total: string    // quantity × price
    }>,
    subtotal: string,
    deliveryCost: "660",  // fixed, hardcoded
    total: string,
    itemCount: number
  })
});

const { orderNumber } = await response.json();
window.location.href = `/korpa/checkout/uspesno?order=${orderNumber}`;
```

### Step 2 — API route transforms and forwards to backend

**File:** `app/api/checkout/route.ts`

```ts
// Payment method mapping
// "cash_on_delivery" → "personal"
// "bank_transfer"    → "invoice"

const backendOrderData = {
  customer: {
    email,
    first_name,
    last_name,
    payment_method: "personal" | "invoice",
    billing_address: {
      country_code: "RS",
      address_line1,
      locality, // city
      postal_code,
      given_name,
      family_name,
    },
    shipping_address: {
      country_code: "RS",
      address_line1,
      locality,
      postal_code,
      given_name,
      family_name,
      phone_number,
    },
  },
  products: Array<{
    product_id: string; // product_code from cart item
    quantity: number;
  }>,
};

const backendRes = await fetch(
  `${process.env.BASE_URL}/api/v1/orders?cc=${process.env.API_HASH}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backendOrderData),
  },
);

const { order_number } = await backendRes.json();
```

### Step 3 — PDF + emails

After the backend responds with `order_number`:

1. **PDF** is generated with `pdf-lib` + DejaVu fonts (needed for Serbian characters). Includes order summary, itemised list, totals, payment instructions.
2. **Owner email** — HTML summary + PDF attached, sent via Resend.
3. **Customer email** — HTML confirmation with order number, payment details (bank account or COD note), sent via Resend.

```ts
// Email provider: Resend
// From: hello@kosmospromet.com
// Owner: kosmosindjija93@gmail.com
```

### API route response

```ts
// Success
{ message: "Emails sent successfully", orderNumber: string }

// Error
{ error: "..." }  // with appropriate HTTP status
```

---

## 7. Backend API Reference

All endpoints on `BASE_URL = https://backend.kosmospromet.com`. Every request requires `?cc={API_HASH}`.

| Method | Endpoint                | Key params                          | Purpose                           |
| ------ | ----------------------- | ----------------------------------- | --------------------------------- |
| `GET`  | `/api/v1/list-products` | `data=all` or `data={slug}`         | Products for homepage or category |
| `GET`  | `/api/v1/get-product`   | `p=/product/{slug}`                 | Single product detail             |
| `GET`  | `/api/v1/search`        | `q={query}`, `type=dropdown` (opt.) | Search                            |
| `POST` | `/api/v1/orders`        | JSON body (see §6)                  | Create order                      |

---

## 8. Caching Strategy Summary

| Page / call                       | Strategy                        | TTL         |
| --------------------------------- | ------------------------------- | ----------- |
| Homepage products                 | ISR (`revalidate`)              | 3600 s      |
| Category pages                    | ISR (`revalidate`)              | 60 s        |
| Single product                    | No cache (`redirect: "manual"`) | —           |
| Search results                    | `revalidate`                    | 300 s       |
| Duplicate calls within one render | React `cache()`                 | per-request |
