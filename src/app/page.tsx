import ProductListSec from "@/components/common/ProductListSec";
import Header from "@/components/homepage/Header";
import OnlineStoreSection from "@/components/homepage/OnlineStoreSection";
import StoreMapSection from "@/components/homepage/StoreMapSection";
import AnkhSeparator from "@/components/common/AnkhSeparator";
import { fetchActionProducts, fetchTopLevelCategories } from "@/lib/api/faraon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Najbolji online diskont pića u Novom Sadu | Faraon diskonti",
  },
  description:
    "Sve što pijete, Faraon donosi! Besplatna dostava za porudžbine preko 12,000 RSD!",
};

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const [products, categories] = await Promise.all([
    fetchActionProducts(),
    fetchTopLevelCategories(),
  ]);

  const hasActions = products.length > 0;

  return (
    <>
      <Header />
      <main className="mb-10 md:mb-12 mt-10 sm:mt-12">
        {hasActions && (
          <ProductListSec
            title="Akcijske cene"
            data={products}
            viewAllLink="/akcije"
            showArrows
          />
        )}
        {hasActions && <AnkhSeparator />}
        <OnlineStoreSection title="Online prodavnica" data={categories} />
        <AnkhSeparator />
        <StoreMapSection isLocationPage={false} />
      </main>
    </>
  );
}
