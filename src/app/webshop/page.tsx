import AnkhSeparator from "@/components/common/AnkhSeparator";
import ProductListSec from "@/components/common/ProductListSec";
import OnlineStoreSection from "@/components/homepage/OnlineStoreSection";
import { categories, newArrivalsData } from "@/data/store-data";

const WebshopPage = () => {
  return (
    <main className="pb-10 md:pb-12 pt-18 sm:pt-24">
      <ProductListSec
        id="akcijske-cene"
        className="max-w-frame mx-auto text-center"
        title="Akcijske cene"
        data={newArrivalsData}
        viewAllLink="/"
        viewAllVariant="brand"
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
