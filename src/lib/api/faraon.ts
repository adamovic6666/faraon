import { CategoryItem } from "@/types/category.types";
import { Product } from "@/types/product.types";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

type ActionApiProduct = {
  id?: string | number;
  sku?: string;
  product_id?: string;
  product_code?: string;
  title: string;
  image: string;
  alias: string;
  akcijska_cena: string;
  cena: string;
  tag?: string;
  packaging?: string;
};

type ActionApiResponse = {
  products?: ActionApiProduct[];
};

type CategoryApiProduct = {
  id?: string | number;
  sku?: string;
  product_id?: string;
  product_code?: string;
  title: string;
  image: string;
  alias: string;
  cena?: string | number;
  akcijska_cena?: string | number;
  sale_price?: string;
  base_price?: string;
  price?: string | number;
  oldPrice?: string | number;
  tag?: string;
  packaging?: string;
};

type CategoryApiResponse = {
  products?: CategoryApiProduct[];
  parent?: {
    title?: string;
    metatags?: {
      title?: string;
      description?: string;
    };
  };
};

type ProductApiResponse = {
  id?: number | string;
  sku?: string;
  product_id?: string;
  product_code?: string;
  title?: string;
  image?: string;
  main_photo?: string;
  srcUrl?: string;
  alias?: string;
  slug?: string;
  cena?: string | number;
  akcijska_cena?: string | number;
  sale_price?: string | number;
  base_price?: string | number;
  price?: string | number;
  oldPrice?: string | number;
  description?: string;
  photo_gallery?: string[] | { thumb?: string[]; orig?: string[] };
  tag?: string;
  packaging?: string;
};

export type PricingTerm = {
  id: number;
  name: string;
  price: string;
  currencyCode: string;
};

export type ShippingRateProduct = {
  sku: string;
  quantity: number;
};

export type ShippingRate = {
  amount: string;
  currencyCode: string;
};

export type BackendOrderPayload = {
  customer: {
    payment_method: "personal" | "invoice";
    cenovnik_term_id: number;
    email: string;
    billing_address: {
      country_code: string;
      address_line1: string;
      locality: string;
      postal_code: string;
      given_name: string;
      family_name: string;
    };
    shipping_address: {
      country_code: string;
      address_line1: string;
      locality: string;
      postal_code: string;
      given_name: string;
      family_name: string;
      phone_number: string;
      pib?: string;
      mb?: string;
    };
  };
  products: Array<{
    product_id: string;
    quantity: number;
  }>;
};

export type CreateOrderResult = {
  orderId: string;
  orderNumber: string;
  message: string;
  warrant?: {
    fileName: string;
    url: string;
  };
  invoicePdf?: {
    fileName: string;
    mimeType: string;
    contentBase64: string;
  };
};

export type OrderInvoice = {
  fileName: string;
  mimeType: string;
  contentBase64: string;
};

type ApiCallResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; details?: string };

const INVOICE_FETCH_TIMEOUT_MS = 7000;

type InvoiceFetchAttempt =
  | { ok: true; data: OrderInvoice }
  | { ok: false; status: number; error: string; details?: string };

const fetchInvoiceFromUrl = async (
  url: string,
  orderId: string,
): Promise<InvoiceFetchAttempt> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), INVOICE_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: "Faktura trenutno nije dostupna.",
        details: await readErrorText(response),
      };
    }

    const payload = (await response.json()) as {
      file_name?: string;
      mime_type?: string;
      content_base64?: string;
    };

    if (!payload.content_base64) {
      return {
        ok: false,
        status: 502,
        error: "Faktura je vraćena bez sadržaja.",
      };
    }

    return {
      ok: true,
      data: {
        fileName: payload.file_name ?? `invoice-${orderId}.pdf`,
        mimeType: payload.mime_type ?? "application/pdf",
        contentBase64: payload.content_base64,
      },
    };
  } catch (error) {
    const isAbortError = error instanceof Error && error.name === "AbortError";
    return {
      ok: false,
      status: isAbortError ? 504 : 500,
      error: isAbortError
        ? "Vreme za preuzimanje fakture je isteklo."
        : "Greška u komunikaciji sa backend-om.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

const getSanitizedBaseUrl = () => {
  const raw = process.env.BASE_URL ?? "";
  return raw.replaceAll(/^[\s'"]+|[\s,'"]+$/g, "").replace(/\/$/, "");
};

const getSanitizedApiBaseUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? process.env.BASE_URL ?? "";
  return raw.replaceAll(/^[\s'"]+|[\s,'"]+$/g, "").replace(/\/$/, "");
};

const toPublicFileUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const base = getSanitizedApiBaseUrl();
  if (!base) {
    return path;
  }

  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};

const getBackendConfig = () => {
  const baseUrl = getSanitizedBaseUrl();
  const hash = (process.env.API_HASH ?? "").trim();

  if (!baseUrl || !hash) {
    return null;
  }

  return { baseUrl, hash };
};

const buildApiUrl = (data: string) => {
  const base = getSanitizedBaseUrl();
  return `${base}/api/v1/list-products?data=${encodeURIComponent(data)}&cc=${process.env.API_HASH}`;
};

const normalizeImageUrl = (image: string) => {
  if (!image) return "/images/placeholder.png";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  const base = getSanitizedBaseUrl();
  return `${base}${image.startsWith("/") ? "" : "/"}${image}`;
};

const toNumber = (value?: string | number) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const resolveProductId = (...candidates: Array<string | number | undefined>) => {
  const first = candidates.find((candidate) => {
    if (candidate === undefined || candidate === null) return false;
    return String(candidate).trim().length > 0;
  });

  return first === undefined ? "" : String(first);
};

const readErrorText = async (response: Response) => {
  try {
    return await response.text();
  } catch {
    return "";
  }
};

export const fetchPricingTerms = async (): Promise<ApiCallResult<PricingTerm[]>> => {
  const config = getBackendConfig();

  if (!config) {
    return {
      ok: false,
      status: 500,
      error: "Nedostaje backend konfiguracija (BASE_URL/API_HASH).",
    };
  }

  try {
    const response = await fetch(
      `${config.baseUrl}/api/v1/pricing?cc=${encodeURIComponent(config.hash)}`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return {
        ok: false,
        status: 502,
        error: "Neuspešno učitavanje cenovnika.",
        details: await readErrorText(response),
      };
    }

    const payload = (await response.json()) as Array<{
      id?: number;
      name?: string;
      field_price?: {
        price?: string;
        currency_code?: string;
      };
    }>;

    const data = (Array.isArray(payload) ? payload : [])
      .filter((item) => typeof item.id === "number" && Boolean(item.name))
      .map((item) => ({
        id: item.id as number,
        name: (item.name ?? "").trim(),
        price: item.field_price?.price ?? "0",
        currencyCode: item.field_price?.currency_code ?? "RSD",
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "sr", { sensitivity: "base" }));

    return { ok: true, data };
  } catch (error) {
    console.error("Pricing fetch failed:", error);
    return {
      ok: false,
      status: 500,
      error: "Došlo je do greške prilikom učitavanja gradova.",
    };
  }
};

export const fetchShippingRate = async ({
  cenovnikTermId,
  products,
}: {
  cenovnikTermId: number;
  products: ShippingRateProduct[];
}): Promise<ApiCallResult<ShippingRate>> => {
  const config = getBackendConfig();

  if (!config) {
    return {
      ok: false,
      status: 500,
      error: "Nedostaje backend konfiguracija (BASE_URL/API_HASH).",
    };
  }

  try {
    const response = await fetch(
      `${config.baseUrl}/api/v1/shipping/rates?cc=${encodeURIComponent(config.hash)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cenovnik_term_id: cenovnikTermId,
          products,
        }),
      },
    );

    if (!response.ok) {
      return {
        ok: false,
        status: response.status === 400 ? 400 : 502,
        error: "Neuspešan obračun dostave.",
        details: await readErrorText(response),
      };
    }

    const payload = (await response.json()) as {
      data?: Array<{ amount?: string; currency_code?: string }>;
    };

    const firstRate = payload.data?.[0];
    if (!firstRate?.amount) {
      return {
        ok: false,
        status: 502,
        error: "Cena dostave nije vraćena od backend-a.",
      };
    }

    return {
      ok: true,
      data: {
        amount: firstRate.amount,
        currencyCode: firstRate.currency_code ?? "RSD",
      },
    };
  } catch (error) {
    console.error("Shipping rate fetch failed:", error);
    return {
      ok: false,
      status: 500,
      error: "Došlo je do greške prilikom obračuna dostave.",
    };
  }
};

export const createOrder = async (
  payload: BackendOrderPayload,
): Promise<ApiCallResult<CreateOrderResult>> => {
  const config = getBackendConfig();

  if (!config) {
    return {
      ok: false,
      status: 500,
      error: "Nedostaje backend konfiguracija (BASE_URL/API_HASH).",
    };
  }

  try {
    const response = await fetch(
      `${config.baseUrl}/api/v1/orders?cc=${encodeURIComponent(config.hash)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await readErrorText(response);
      return {
        ok: false,
        status: response.status === 400 ? 400 : 502,
        error: "Kreiranje porudžbine nije uspelo.",
        details: errorText,
      };
    }

    const result = (await response.json()) as {
      order_id?: string | number;
      order_number?: string | number;
      message?: string;
      warrant?: string;
      file_name?: string;
      mime_type?: string;
      content_base64?: string;
    };

    if (!result.order_id || !result.order_number) {
      return {
        ok: false,
        status: 502,
        error: "Backend nije vratio kompletne podatke porudžbine.",
      };
    }

    return {
      ok: true,
      data: {
        orderId: String(result.order_id),
        orderNumber: String(result.order_number),
        message: result.message ?? "Porudžbina je uspešno kreirana.",
        ...(result.warrant
          ? {
              warrant: {
                fileName:
                  result.warrant.split("/").findLast(Boolean) ??
                  `warrant-${result.order_id}.pdf`,
                url: toPublicFileUrl(result.warrant),
              },
            }
          : {}),
        ...(result.content_base64
          ? {
              invoicePdf: {
                fileName: result.file_name ?? `invoice-${result.order_id}.pdf`,
                mimeType: result.mime_type ?? "application/pdf",
                contentBase64: result.content_base64,
              },
            }
          : {}),
      },
    };
  } catch (error) {
    console.error("Create order call failed:", error);
    return {
      ok: false,
      status: 500,
      error: "Došlo je do greške prilikom obrade porudžbine.",
    };
  }
};

export const fetchOrderInvoice = async (
  orderId: string,
): Promise<ApiCallResult<OrderInvoice>> => {
  const config = getBackendConfig();

  if (!config) {
    return {
      ok: false,
      status: 500,
      error: "Nedostaje backend konfiguracija (BASE_URL/API_HASH).",
    };
  }

  const candidateUrls = [
    `${config.baseUrl}/api/v1/orders/${encodeURIComponent(orderId)}/invoice?cc=${encodeURIComponent(config.hash)}`,
  ];

  let lastStatus = 502;
  let lastError = "";

  for (const url of candidateUrls) {
    const attempt = await fetchInvoiceFromUrl(url, orderId);
    if (attempt.ok) {
      return {
        ok: true,
        data: attempt.data,
      };
    }

    lastStatus = attempt.status;
    lastError = attempt.details || attempt.error;
  }

  return {
    ok: false,
    status: lastStatus === 400 ? 400 : 502,
    error: "Faktura trenutno nije dostupna.",
    details: lastError,
  };
};

const mapActionProduct = (item: ActionApiProduct, index: number): Product => {
  const price = toNumber(item.akcijska_cena) || toNumber(item.cena);
  const oldPrice = toNumber(item.cena);

  return {
    id: resolveProductId(item.product_code, item.sku, item.product_id, item.id, item.alias, index + 1),
    title: item.title,
    srcUrl: normalizeImageUrl(item.image),
    oldPrice: oldPrice || undefined,
    price,
    slug: item.alias?.split("/").findLast(Boolean),
    tag: item.tag,
    packaging: item.packaging,
  };
};

const mapCategoryProducts = (items: CategoryApiProduct[] = []): Product[] => {
  return items.map((item, index) => {
    const basePrice = toNumber(
      item.cena
    );
    const salePrice = toNumber(
      item.akcijska_cena,
    );
    const price = salePrice > 0 ? salePrice : basePrice;
    const oldPrice = basePrice > price && price > 0 ? basePrice : undefined;

    return {
      id: resolveProductId(item.product_code, item.sku, item.product_id, item.id, item.alias, index + 1),
      title: item.title,
      srcUrl: normalizeImageUrl(item.image),
      slug: item.alias?.split("/").findLast(Boolean),
      price,
      oldPrice,
      tag: item.tag,
      packaging: item.packaging,
    };
  });
};

const mapProductDetails = (payload: ProductApiResponse): Product => {
  const mainImage = payload.main_photo ?? payload.image ?? payload.srcUrl ?? "";
  const normalizedMainImage = normalizeImageUrl(mainImage);
  const galleryFromPayload = Array.isArray(payload.photo_gallery)
    ? payload.photo_gallery
    : [
        ...(payload.photo_gallery?.orig ?? []),
        ...(payload.photo_gallery?.thumb ?? []),
      ];
  const galleryImages = Array.from(
    new Set(
      galleryFromPayload
        .filter(Boolean)
        .map((image) => normalizeImageUrl(image))
        .filter((image) => image !== normalizedMainImage),
    ),
  );

  const basePrice = toNumber(
    payload.cena ?? payload.base_price ?? payload.oldPrice ?? payload.price,
  );
  const salePrice = toNumber(
    payload.akcijska_cena ?? payload.sale_price ?? payload.price ?? payload.cena,
  );
  const price = salePrice > 0 ? salePrice : basePrice;
  const oldPrice = basePrice > price && price > 0 ? basePrice : undefined;

  return {
    id: resolveProductId(payload.product_code, payload.sku, payload.product_id, payload.id, payload.slug, 1),
    title: payload.title ?? "",
    srcUrl: normalizedMainImage,
    galleryImages,
    price,
    oldPrice,
    description: payload.description,
    slug: payload.alias?.split("/").findLast(Boolean) ?? payload.slug,
    tag: payload.tag,
    packaging: payload.packaging,
  };
};

export const fetchTopLevelCategories = async (): Promise<CategoryItem[]> => {
  try {
    const res = await fetch(buildApiUrl("all"), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
};

export const fetchActionProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(buildApiUrl("akcija"), { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const payload: ActionApiResponse = await res.json();
    const items = payload.products ?? [];

    return items.map((item, index) => mapActionProduct(item, index));
  } catch {
    return [];
  }
};

export const fetchCategoryProducts = async (
  pathname: string,
): Promise<{ products: Product[]; title: string; metatags: { title: string; description: string } }> => {
  try {
    const res = await fetch(buildApiUrl(pathname), { next: { revalidate: 60 } });
    if (!res.ok) return { products: [], title: "", metatags: { title: "", description: "" } };

    const payload: CategoryApiResponse = await res.json();

    return {
      products: mapCategoryProducts(payload.products ?? []),
      title: payload.parent?.metatags?.title ?? payload.parent?.title ?? "",
      metatags: {
        title: payload.parent?.metatags?.title ?? payload.parent?.title ?? "",
        description: payload.parent?.metatags?.description ?? "",
      },
    };
  } catch {
    return { products: [], title: "", metatags: { title: "", description: "" } };
  }
};

export const fetchProductBySlug = cache(
  async (slug: string, category?: string): Promise<Product> => {
  const baseUrl = getSanitizedApiBaseUrl();
  if (!baseUrl) {
    throw new Error("Missing API base URL in NEXT_PUBLIC_API_URL/BASE_URL");
  }

  const categoryPath = category ? `/prodavnica/${category}/${slug}` : "";
  const productPaths = [
    categoryPath,
    `/product/${slug}`,
    `/proizvod/${slug}`,
  ].filter(Boolean);
  let lastStatus = 0;
  let lastBody = "";

  for (const productPath of productPaths) {
    const endpoint = new URL("/api/v1/get-product", baseUrl);
    endpoint.searchParams.set("p", productPath);
    endpoint.searchParams.set("cc", process.env.API_HASH ?? "");

    const response = await fetch(endpoint.toString(), { redirect: "manual" });

    if (
      response.status === 301 ||
      response.status === 302 ||
      response.status === 308
    ) {
      redirect("/prodavnica");
    }

    if (response.status === 403) {
      throw new Error("Access forbidden");
    }

    if (response.ok) {
      const payload: ProductApiResponse = await response.json();
      return mapProductDetails(payload);
    }

    lastStatus = response.status;
    lastBody = await response.text();

    if (response.status === 400 || response.status === 404) {
      continue;
    }

    console.error(
      `API error for slug ${slug} with path ${productPath}:`,
      response.status,
      lastBody.slice(0, 200),
    );
    throw new Error(`Failed to fetch product: ${response.status}`);
  }

  if (lastStatus === 404) {
    notFound();
  }

  console.error(`API error for slug ${slug}:`, lastStatus, lastBody.slice(0, 200));
  throw new Error(`Failed to fetch product: ${lastStatus || 400}`);
},
);
