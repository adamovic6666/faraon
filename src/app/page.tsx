import ProductListSec from "@/components/common/ProductListSec";
import Header from "@/components/homepage/Header";
import OnlineStoreSection from "@/components/homepage/OnlineStoreSection";
import StoreMapSection from "@/components/homepage/StoreMapSection";
import AnkhSeparator from "@/components/common/AnkhSeparator";
import { newArrivalsData, categories } from "@/data/store-data";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mb-10 md:mb-12 mt-10 sm:mt-12">
        <ProductListSec
          title="Akcijske cene"
          data={newArrivalsData}
          viewAllLink="/akcije"
          viewAllVariant="brand"
          showArrows
        />
        <AnkhSeparator />
        <OnlineStoreSection title="Online prodavnica" data={categories} />
        <AnkhSeparator />
        <StoreMapSection isLocationPage={false} />
      </main>
    </>
  );
}
