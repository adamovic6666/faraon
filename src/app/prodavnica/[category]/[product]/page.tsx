import { fetchActionProducts, fetchProductBySlug } from "@/lib/api/faraon";
import Header from "@/components/product-page/Header";
import AnkhSeparator from "@/components/common/AnkhSeparator";
import ProductListSec from "@/components/common/ProductListSec";

export default async function ProductPage({
  params,
}: Readonly<{
  params: Promise<{ category: string; product: string }>;
}>) {
  const resolvedParams = await params;
  const { category, product } = resolvedParams;
  const productData = await fetchProductBySlug(product, category);
  const actionProducts = await fetchActionProducts();

  return (
    <main className="pt-20 pb-2 md:pt-24">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <section>
          <Header data={productData} />
        </section>
      </div>

      <div className="mt-10 md:mt-12">
        <AnkhSeparator />
      </div>

      <ProductListSec
        title="Akcijske cene"
        data={actionProducts}
        viewAllLink="/akcije"
        viewAllVariant="brand"
        showArrows
        noAnimation
      />

      <AnkhSeparator />
    </main>
  );
}
