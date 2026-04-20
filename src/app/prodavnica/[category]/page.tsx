import { cache } from "react";
import type { Metadata } from "next";
import CategoryProductGrid from "@/components/shop-page/CategoryProductGrid";
import { fetchCategoryProducts } from "@/lib/api/faraon";

const getCategoryData = cache(async (category: string) => {
  const pathname = `/prodavnica/${category}`;
  return fetchCategoryProducts(pathname);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const { metatags } = await getCategoryData(category);

  return {
    title: metatags.title || undefined,
    description: metatags.description || undefined,
  };
}

export default async function CategoryPage({
  params,
}: Readonly<{
  params: Promise<{ category: string }>;
}>) {
  const resolvedParams = await params;
  const { products, title } = await getCategoryData(resolvedParams.category);
  const titleWithoutPrefix = title.split(" | ")[0].trim();

  return (
    <div className="max-w-frame mx-auto px-4 xl:px-0 pt-18 sm:pt-24 pb-10 md:pb-12">
      <CategoryProductGrid products={products} title={titleWithoutPrefix} />
    </div>
  );
}
