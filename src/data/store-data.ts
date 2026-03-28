import { CategoryItem } from "@/types/category.types";
import { Product } from "@/types/product.types";

const bezalkoholnaBase: Product[] = [
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
    title: "Mr.Zox Aloe Vera Mango 0.5L Pet",
    srcUrl: "/images/mr-zox-aloe-vera-mango.jpg",
    oldPrice: 122,
    price: 110,
    discount: 10,
  },
];

export const bezalkoholnaPicaProducts: Product[] = Array.from(
  { length: 60 },
  (_, i) => ({ ...bezalkoholnaBase[i % 4], id: i + 1 })
);

export const categoryProductsMap: Record<string, Product[]> = {
  "bezalkoholna-pica": bezalkoholnaPicaProducts,
};

export const categoryLabelsMap: Record<string, string> = {
  "bezalkoholna-pica": "Bezalkoholna pića",
  "alkoholna-pica": "Žestoka alkoholna pića",
  piva: "Piva",
  vina: "Vina",
  vode: "Vode",
  "kafe-cajevi-napici": "Čajevi, kafe i napici",
  likeri: "Sirupi i likeri",
  led: "Led",
};

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

export const categories: CategoryItem[] = [
  {
    id: 1,
    title: "Bezalkoholna pića",
    count: 84,
    icon: "/images/bezalkoholna-pica.svg",
    badge: "Popularno",
    href: "/webshop/bezalkoholna-pica",
  },
  {
    id: 2,
    title: "Žestoka alkoholna pića",
    count: 126,
    icon: "/images/alkoholna-pica.svg",
    href: "/"
  },
  {
    id: 3,
    title: "Piva",
    count: 63,
    icon: "/images/piva.svg",
    badge: "Novo",
        href: "/"

  },
  {
    id: 4,
    title: "Vina",
    count: 97,
    icon: "/images/vina.svg",
        href: "/"

  },
  {
    id: 5,
    title: "Vode",
    count: 32,
    icon: "/images/vode.svg",
        href: "/"

  },
  {
    id: 6,
    title: "Čajevi, kafe i napici",
    count: 45,
    icon: "/images/kafe-cajevi-napici.svg",
        href: "/"

  },
  {
    id: 7,
    title: "Sirupi i likeri",
    count: 38,
    icon: "/images/likeri.svg",
        href: "/"

  },
  {
    id: 8,
    title: "Led",
    count: 21,
    icon: "/images/led.svg",
        href: "/"

  },
];
