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
    id: 1,
    type: "MenuItem",
    label: "Akcije",
    url: "/#akcijske-cene",
    children: [],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "Online prodavnica",
    url: "/#online-prodavnica",
    children: [],
  },
  {
    id: 3,
    type: "MenuItem",
    label: "Diskonti",
    url: "/diskonti",
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
    <nav className="fixed inset-x-0 top-0 z-100 bg-white">
      <div className="relative mx-auto flex min-h-18 max-w-frame items-center justify-between px-4 md:min-h-[88px] xl:px-0">
        <div className="flex items-center w-full">
          <div className="block md:hidden mr-4">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/"
            className={cn([
              integralCF.className,
              "text-2xl font-semibold lg:text-[32px] mr-3 lg:mr-10 text-brand",
            ])}
          >
            FARAON DISKONTI
          </Link>
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
              placeholder="Pretraži proizvode..."
              className="bg-transparent placeholder:text-black/40"
            />
          </InputGroup>
        </div>

        <div className="flex items-center">
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
