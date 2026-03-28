import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link";
import { NavMenu } from "../navbar.types";
import Image from "next/image";
import InputGroup from "@/components/ui/input-group";
import ResTopNavbar from "./ResTopNavbar";
import CartBtn from "./CartBtn";

const data: NavMenu = [
  {
    id: 2,
    type: "MenuList",
    label: "Online prodavnica",
    children: [
      { id: 25, label: "Bezalkoholna pića", url: "/webshop/bezalkoholna-pica" },
      { id: 21, label: "Žestoka alkoholna pića", url: "/" },
      { id: 23, label: "Piva", url: "/" },
      { id: 22, label: "Vina", url: "/" },
      { id: 27, label: "Vode", url: "/" },
      { id: 26, label: "Čajevi, kafe i napici", url: "/" },
      { id: 24, label: "Sirupi i likeri", url: "/" },
      { id: 28, label: "Led", url: "/" },
    ],
  },
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

const TopNavbar = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-100 bg-white h-16">
      <div className="relative mx-auto flex h-full max-w-frame items-center justify-between px-4 xl:px-0">
        <div className="flex items-center md:w-full">
          <div className="mr-4 block shrink-0 pt-[3px] md:hidden mt-0.5">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/"
            className={cn([
              integralCF.className,
              "mr-auto text-2xl font-semibold text-brand lg:text-[32px] md:mr-3 lg:mr-10",
            ])}
          >
            FARAON DISKONTI
          </Link>
        </div>

        <div className="flex items-center w-auto  md:w-full">
          <InputGroup className="hidden w-full max-w-52 bg-[#F0F0F0] md:ml-auto md:mr-3 md:flex md:max-w-xl lg:ml-6">
            <InputGroup.Text>
              <Image
                priority
                src="/icons/search.svg"
                height={20}
                width={20}
                alt="search"
                className="min-w-5 min-h-5"
              />
            </InputGroup.Text>
            <InputGroup.Input
              type="search"
              name="search"
              placeholder="Pretraži proizvode po nazivu..."
              className="bg-transparent placeholder:text-black/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
            />
          </InputGroup>
          <Link href="/" className="mr-1 block p-1 md:hidden">
            <Image
              priority
              src="/icons/search-black.svg"
              height={100}
              width={100}
              alt="search"
              className="max-h-5.5 max-w-5.5"
            />
          </Link>
          <CartBtn />
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
