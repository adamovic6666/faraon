import ProductListSec from "@/components/common/ProductListSec";
import Header from "@/components/homepage/Header";
import OnlineStoreSection from "@/components/homepage/OnlineStoreSection";
import StoreMapSection from "@/components/homepage/StoreMapSection";
import { CategoryItem } from "@/types/category.types";
import { Product } from "@/types/product.types";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export const newArrivalsData: Product[] = [
  {
    id: 1,
    title: "Rosa Voda Negazirana 0.75L\nNepovratno Staklo",
    srcUrl: "/images/rosa-voda.jpg",
    oldPrice: 200,
    price: 160,
    discount: 20,
  },
  {
    id: 2,
    title: "Fruvita 100% Jabuka 0.75L\nPET",
    srcUrl: "/images/fruvita-sok.jpg",
    oldPrice: 300,
    price: 225,
    discount: 25,
  },
  {
    id: 3,
    title: "Pepsi Max 0.33L Limenka",
    srcUrl: "/images/pepsi-limenka.jpg",
    oldPrice: 70,
    price: 49,
    discount: 30,
  },
  {
    id: 4,
    title: "Smirnoff Vodka 1L",
    srcUrl: "/images/smirnoff-vodka.jpg",
    oldPrice: 2000,
    price: 1200,
    discount: 40,
  },
  {
    id: 5,
    title: "Mr.Zox Aloe Vera Mango 0.5L Pet",
    srcUrl: "/images/mr-zox-aloe-vera-mango.jpg",
    oldPrice: 122,
    price: 110,
    discount: 10,
  },
  {
    id: 6,
    title: "Budweiser Pivo 0.5L Limenka",
    srcUrl: "/images/budweiser-pivo.jpg",
    oldPrice: 140,
    price: 118,
    discount: 20,
  },
];

const categories: CategoryItem[] = [
  {
    id: 2,
    title: "Žestoka alkoholna pića",
    count: 126,
    icon: "/images/alkoholna-pica.svg",
  },
  {
    id: 4,
    title: "Vina",
    count: 97,
    icon: "/images/vina.svg",
  },
  {
    id: 3,
    title: "Piva",
    count: 63,
    icon: "/images/piva.svg",
    badge: "Novo",
  },
  {
    id: 7,
    title: "Sirupi i likeri",
    count: 38,
    icon: "/images/likeri.svg",
  },
  {
    id: 1,
    title: "Bezalkoholna pića",
    count: 84,
    icon: "/images/bezalkoholna-pica.svg",
    badge: "Popularno",
  },
  {
    id: 6,
    title: "Čajevi, kafe i napici",
    count: 45,
    icon: "/images/kafe-cajevi-napici.svg",
  },
  {
    id: 5,
    title: "Vode",
    count: 32,
    icon: "/images/vode.svg",
  },
  {
    id: 8,
    title: "Led",
    count: 21,
    icon: "/images/led.svg",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="mb-12 mt-8 sm:mt-12">
        <ProductListSec
          id="akcijske-cene"
          className="max-w-frame mx-auto text-center"
          title="Akcijske cene"
          data={newArrivalsData}
          viewAllLink="/"
          viewAllVariant="brand"
          showArrows
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <div className="my-8 flex items-center gap-3 sm:my-12">
            <Separator className="bg-black/10 flex-1" />
            <Image
              src="/images/ankh.svg"
              alt="Ankh"
              width={16}
              height={16}
              className="opacity-35"
            />
            <Separator className="bg-black/10 flex-1" />
          </div>
        </div>
        <OnlineStoreSection
          id="online-prodavnica"
          title="Online prodavnica"
          data={categories}
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <div className="my-8 flex items-center gap-3 sm:my-12">
            <Separator className="bg-black/10 flex-1" />
            <Image
              src="/images/ankh.svg"
              alt="Ankh"
              width={16}
              height={16}
              className="opacity-35"
            />
            <Separator className="bg-black/10 flex-1" />
          </div>
        </div>
        <StoreMapSection />
      </main>
    </>
  );
}
