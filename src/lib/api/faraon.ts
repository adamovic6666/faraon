import { CategoryItem } from "@/types/category.types";
import { Product } from "@/types/product.types";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

type ActionApiProduct = {
  title: string;
  image: string;
  alias: string;
  sale_price: string;
  base_price: string;
};

type ActionApiResponse = {
  products?: ActionApiProduct[];
};

type CategoryApiProduct = {
  title: string;
  image: string;
  alias: string;
  cena?: string | number;
  akcijska_cena?: string | number;
  sale_price?: string;
  base_price?: string;
  price?: string | number;
  oldPrice?: string | number;
};

type CategoryApiResponse = {
  products?: CategoryApiProduct[];
  parent?: {
    title?: string;
    metatags?: {
      title?: string;
    };
  };
};

type ProductApiResponse = {
  id?: number | string;
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
};

const getSanitizedBaseUrl = () => {
  const raw = process.env.BASE_URL ?? "";
  return raw.replaceAll(/^[\s'"]+|[\s,'"]+$/g, "").replace(/\/$/, "");
};

const getSanitizedApiBaseUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? process.env.BASE_URL ?? "";
  return raw.replaceAll(/^[\s'"]+|[\s,'"]+$/g, "").replace(/\/$/, "");
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

const mapActionProduct = (item: ActionApiProduct, index: number): Product => {
  const price = toNumber(item.sale_price);
  const oldPrice = toNumber(item.base_price);

  return {
    id: index + 1,
    title: item.title,
    srcUrl: normalizeImageUrl(item.image),
    oldPrice: oldPrice || undefined,
    price,
    slug: item.alias?.split("/").findLast(Boolean),
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
      id: index + 1,
      title: item.title,
      srcUrl: normalizeImageUrl(item.image),
      slug: item.alias?.split("/").findLast(Boolean),
      price,
      oldPrice,
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
    id: toNumber(payload.id) || 1,
    title: payload.title ?? "",
    srcUrl: normalizedMainImage,
    galleryImages,
    price,
    oldPrice,
    description: payload.description,
    slug: payload.alias?.split("/").findLast(Boolean) ?? payload.slug,
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
): Promise<{ products: Product[]; title: string }> => {
  try {
    const res = await fetch(buildApiUrl(pathname), { next: { revalidate: 60 } });
    if (!res.ok) return { products: [], title: "" };

    const payload: CategoryApiResponse = await res.json();

    return {
      products: mapCategoryProducts(payload.products ?? []),
      title: payload.parent?.metatags?.title ?? payload.parent?.title ?? "",
    };
  } catch {
    return { products: [], title: "" };
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
