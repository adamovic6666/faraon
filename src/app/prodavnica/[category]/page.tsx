// import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import CategoryProductGrid from "@/components/shop-page/CategoryProductGrid";
import { categoryProductsMap, categoryLabelsMap } from "@/data/store-data";

export default async function CategoryPage({
  params,
}: Readonly<{
  params: Promise<{ category: string }>;
}>) {
  const { category } = await params;
  const products = categoryProductsMap[category] ?? [];
  const categoryLabel = categoryLabelsMap[category] ?? category;

  return (
    <div className="max-w-frame mx-auto px-4 xl:px-0 pt-18 sm:pt-24 pb-10 md:pb-12">
      {/* <BreadcrumbShop /> */}
      <CategoryProductGrid products={products} categoryLabel={categoryLabel} />
    </div>
  );
}
