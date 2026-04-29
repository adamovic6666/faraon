import SearchResultsGrid from "@/components/shop-page/SearchResultsGrid";
import { searchProducts } from "@/lib/features/products/search.server";
import { Product } from "@/types/product.types";

export const revalidate = 300; // Cache for 5 minutes

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

const normalizeImageUrl = (image: string) => {
  if (!image) return "/images/placeholder.png";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  const baseUrl = "https://staging.backend.faraondiskonti.rs";
  return `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`;
};

const toNumber = (value?: string | number) => {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const normalized = String(value)
    .trim()
    .replaceAll(/\s/g, "")
    .replaceAll(/\.(?=\d{3}(\D|$))/g, "")
    .replace(/,(?=\d{1,2}$)/, ".")
    .replaceAll(",", "");

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

async function mapSearchResultToProduct(result: any): Promise<Product> {
  // Extract slug and category from URL
  let slug = "";
  let category = "";

  if (result.url) {
    // URL format could be:
    // /prodavnica/category/slug
    // /category/slug
    // /slug
    const parts = result.url.split("/").filter(Boolean);

    if (parts.includes("prodavnica")) {
      // Format: /prodavnica/category/slug
      const prodavnicaIndex = parts.indexOf("prodavnica");
      category = parts[prodavnicaIndex + 1] || "";
      slug = parts[prodavnicaIndex + 2] || "";
    } else if (parts.length >= 2) {
      // Format: /category/slug
      category = parts[0];
      slug = parts[1];
    } else if (parts.length === 1) {
      // Only slug provided
      slug = parts[0];
    }
  }

  // Fallback to explicit fields
  if (!slug) {
    slug = result.slug || result.alias?.split("/").findLast(Boolean) || "";
  }
  if (!category) {
    category = result.category || result.categories || "";
  }

  // Extract main image
  const mainImage = result.main_photo || result.image || result.imageUrl || "";

  // Extract prices

  const basePrice = toNumber(
    result.cena ?? result.base_price ?? result.price ?? 0,
  );
  const salePrice = toNumber(result.akcijska_cena ?? result.sale_price ?? 0);
  const price = salePrice > 0 ? salePrice : basePrice;
  const oldPrice = basePrice > price && price > 0 ? basePrice : undefined;

  return {
    id: String(result.sku ?? result.product_id ?? result.id ?? slug ?? "1"),
    title: result.title || "",
    srcUrl: normalizeImageUrl(mainImage),
    price,
    oldPrice,
    slug: slug || "unknown",
    category: category || "bezalkholna-pica",
    description: result.description,
    tag: result.tag,
    packaging: result.packaging,
  };
}

export default async function SearchPage({
  searchParams,
}: Readonly<SearchPageProps>) {
  const params = await searchParams;
  const query = params.q || "";

  let products: Product[] = [];

  if (query.length >= 2) {
    const searchResults = await searchProducts(query);
    products = await Promise.all(
      searchResults.map((result) => mapSearchResultToProduct(result)),
    );
  }

  return (
    <div className="max-w-frame mx-auto px-4 xl:px-0 pt-18 sm:pt-24 pb-10 md:pb-12">
      <SearchResultsGrid products={products} query={query} />
    </div>
  );
}
