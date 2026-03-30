import { categoryProductsMap, newArrivalsData } from "@/data/store-data";
import Header from "@/components/product-page/Header";
import { Product } from "@/types/product.types";
import { notFound } from "next/navigation";
import AnkhSeparator from "@/components/common/AnkhSeparator";
import ProductListSec from "@/components/common/ProductListSec";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replaceAll("\n", " ")
    .replaceAll(/[^a-z0-9\s-]/g, "")
    .trim()
    .replaceAll(/\s+/g, "-");

const getProductSlug = (product: Product) =>
  product.slug ?? slugify(product.title);

export default async function ProductPage({
  params,
}: Readonly<{
  params: Promise<{ category: string; slug: string }>;
}>) {
  const { category, slug } = await params;
  const categoryProducts = categoryProductsMap[category] ?? newArrivalsData;

  const productData = categoryProducts.find(
    (product) => getProductSlug(product) === slug,
  );

  if (!productData?.title) {
    notFound();
  }

  const showOnlyMainImage =
    category === "bezalkholna-pica" && slug === "fruvita-100-jabuka-075l-pet";

  return (
    <main className="pt-20 pb-2 md:pt-24">
      {/* <BreadcrumbProduct title={productData?.title ?? "product"} /> */}
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        {/* <hr className="h-px border-t-black/10 mb-5 sm:mb-6" /> */}
        {/* <BreadcrumbProduct
          title={productData.title}
          categoryLabel={categoryLabelsMap[category] ?? "Webshop"}
          categoryHref={`/webshop/${category}`}
        /> */}
        <section>
          <Header data={productData} showOnlyMainImage={showOnlyMainImage} />
        </section>
      </div>

      <div className="mt-10 md:mt-12">
        <AnkhSeparator />
      </div>

      <ProductListSec
        title="Akcijske cene"
        data={newArrivalsData}
        viewAllLink="/akcije"
        viewAllVariant="brand"
        showArrows
      />

      <AnkhSeparator />
    </main>
  );
}
