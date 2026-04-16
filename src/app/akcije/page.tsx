import CategoryProductGrid from "@/components/shop-page/CategoryProductGrid";
import { fetchActionProducts } from "@/lib/api/faraon";

export const revalidate = 3600; // Revalidate every hour

export default async function AkcijePage() {
  const actionProducts = await fetchActionProducts();

  return (
    <div className="max-w-frame mx-auto px-4 xl:px-0 pt-18 sm:pt-24 pb-10 md:pb-12">
      <CategoryProductGrid products={actionProducts} title="Akcijske cene" />
    </div>
  );
}
