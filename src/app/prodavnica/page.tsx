import AnkhSeparator from "@/components/common/AnkhSeparator";
import ProductListSec from "@/components/common/ProductListSec";
import OnlineStoreSection from "@/components/homepage/OnlineStoreSection";
import { fetchActionProducts, fetchTopLevelCategories } from "@/lib/api/faraon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sve za vašu proslavu i kućne zalihe pića",
  description:
    "Od vode i sokova do piva i vrhunskih vina. Pronađi kafu, čajeve i sve što ti je potrebno za kompletnu nabavku po diskontnim cenama. Najbolja dostava pića u Novom Sadu.",
};

const WebshopPage = async () => {
  const [actionProducts, categories] = await Promise.all([
    fetchActionProducts(),
    fetchTopLevelCategories(),
  ]);

  const hasActions = actionProducts.length > 0;

  return (
    <main className="pb-10 md:pb-12 pt-18 sm:pt-24">
      {hasActions && (
        <ProductListSec
          id="akcijske-cene"
          className="max-w-frame mx-auto text-center"
          title="Akcijske cene"
          data={actionProducts}
          viewAllLink="/akcije"
          showArrows
        />
      )}
      {hasActions && <AnkhSeparator />}
      <OnlineStoreSection
        id="online-prodavnica"
        title="Online prodavnica"
        data={categories}
      />
    </main>
  );
};

export default WebshopPage;
