import AnkhSeparator from "@/components/common/AnkhSeparator";
import ProductListSec from "@/components/common/ProductListSec";
import OnlineStoreSection from "@/components/homepage/OnlineStoreSection";
import { fetchActionProducts, fetchTopLevelCategories } from "@/lib/api/faraon";

const WebshopPage = async () => {
  const [actionProducts, categories] = await Promise.all([
    fetchActionProducts(),
    fetchTopLevelCategories(),
  ]);

  return (
    <main className="pb-10 md:pb-12 pt-18 sm:pt-24">
      <ProductListSec
        id="akcijske-cene"
        className="max-w-frame mx-auto text-center"
        title="Akcijske cene"
        data={actionProducts}
        viewAllLink="/akcije"
        showArrows
      />
      <AnkhSeparator />
      <OnlineStoreSection
        id="online-prodavnica"
        title="Online prodavnica"
        data={categories}
      />
    </main>
  );
};

export default WebshopPage;
