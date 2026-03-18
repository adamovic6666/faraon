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
    title: "Pepsi Max 330mL Limenka",
    srcUrl: "/images/pepsi-limenka.jpg",
    oldPrice: 70,
    price: 49,
    discount: 30,
  },
  {
    id: 4,
    title: "Smirnoff Vodka 1L",
    srcUrl: "/images/smirnoff-vodka.jpg",
    oldPrice: 12000,
    price: 10000,
    discount: 40,
  },
];

export const topSellingData: Product[] = [
  {
    id: 5,
    title: "Vertical Striped Shirt",
    srcUrl: "/images/pic5.png",
    price: 232,
  },
  {
    id: 6,
    title: "Courage Graphic T-shirt",
    srcUrl: "/images/pic6.png",
    price: 145,
  },
  {
    id: 7,
    title: "Loose Fit Bermuda Shorts",
    srcUrl: "/images/pic7.png",
    price: 80,
  },
  {
    id: 8,
    title: "Faded Skinny Jeans",
    srcUrl: "/images/pic8.png",
    price: 210,
  },
];

export const relatedProductData: Product[] = [
  {
    id: 12,
    title: "Polo with Contrast Trims",
    srcUrl: "/images/pic12.png",
    price: 242,
  },
  {
    id: 13,
    title: "Gradient Graphic T-shirt",
    srcUrl: "/images/pic13.png",
    price: 145,
  },
  {
    id: 14,
    title: "Polo with Tipping Details",
    srcUrl: "/images/pic14.png",
    price: 180,
  },
  {
    id: 15,
    title: "Black Striped T-shirt",
    srcUrl: "/images/pic15.png",
    price: 150,
  },
];

const categories: CategoryItem[] = [
  {
    id: 1,
    title: "Bezalkoholna pića",
    count: 84,
    icon: "/images/bezalkoholna-pica.svg",
    badge: "Popularno",
  },
  {
    id: 2,
    title: "Žestoka alkoholna pića",
    count: 126,
    icon: "/images/zestoka-alkoholna-pica.svg",
  },
  {
    id: 3,
    title: "Piva",
    count: 63,
    icon: "/images/pica.svg",
    badge: "Novo",
  },
  {
    id: 4,
    title: "Vina",
    count: 97,
    icon: "/images/vina.svg",
  },
  {
    id: 5,
    title: "Vode",
    count: 32,
    icon: "/images/vode.svg",
  },
  {
    id: 6,
    title: "Čajevi, kafe i napici",
    count: 45,
    icon: "/images/cajevi-kafe-i-napici.svg",
  },
  {
    id: 7,
    title: "Sirupi i likeri",
    count: 38,
    icon: "/images/sirupi-i-likeri.svg",
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
      <main className="my-12.5 sm:my-18">
        <ProductListSec
          title="Kraljevski popusti"
          data={newArrivalsData}
          viewAllLink="/shop#new-arrivals"
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <div className="my-10 sm:my-16 flex items-center gap-3">
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
        <OnlineStoreSection title="Online prodavnica" data={categories} />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <div className="my-10 sm:my-16 flex items-center gap-3">
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
