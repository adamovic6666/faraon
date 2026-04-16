import CategoryProductGrid from "@/components/shop-page/CategoryProductGrid";
import { fetchCategoryProducts } from "@/lib/api/faraon";

export default async function CategoryPage({
  params,
}: Readonly<{
  params: Promise<{ category: string }>;
}>) {
  const resolvedParams = await params;
  const pathname = `/prodavnica/${resolvedParams.category}`;

  const { products, title } = await fetchCategoryProducts(pathname);

  return (
    <div className="max-w-frame mx-auto px-4 xl:px-0 pt-18 sm:pt-24 pb-10 md:pb-12">
      <CategoryProductGrid products={products} title={title} />
    </div>
  );
}
