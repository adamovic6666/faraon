import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link";
import { NavMenu } from "../navbar.types";
import ResTopNavbar from "./ResTopNavbar";
import CartBtn from "./CartBtn";
import SearchProducts from "./SearchProducts";
import { CategoryItem } from "@/types/category.types";

const staticMenuItems: NavMenu = [
  {
    id: 3,
    type: "MenuItem",
    label: "Diskonti",
    url: "/lokacije",
    children: [],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "Kontakt",
    url: "/kontakt",
    children: [],
  },
];

const TopNavbar = ({ categories = [] }: { categories?: CategoryItem[] }) => {
  const data: NavMenu = [
    {
      id: 2,
      type: "MenuList",
      label: "Online prodavnica",
      children: categories.map((cat, index) => ({
        id: cat.id ?? index + 20,
        label: cat.name,
        url: cat.alias,
      })),
    },
    ...staticMenuItems,
  ];
  return (
    <nav className="fixed inset-x-0 top-0 z-100 bg-white h-16">
      <div className="relative mx-auto flex h-full max-w-frame items-center justify-between px-4 xl:px-0">
        <div className="flex min-w-0 flex-1 items-center">
          <div className="mr-4 block shrink-0 pt-0.75 md:hidden mt-0.5">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/"
            className={cn([
              integralCF.className,
              "mr-auto whitespace-nowrap text-2xl font-semibold text-brand md:mr-3 md:text-[34px] lg:mr-10 lg:text-[32px]",
            ])}
          >
            FARAON DISKONTI
          </Link>
        </div>

        <div className="z-101 ml-3 flex shrink-0 items-center gap-1 md:gap-2">
          <SearchProducts
            variant="desktop"
            className="hidden bg-[#F0F0F0] md:flex md:w-[min(41vw,540px)] lg:w-[min(44vw,560px)]"
          />
          <SearchProducts variant="mobile-overlay" />
          <CartBtn />
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
