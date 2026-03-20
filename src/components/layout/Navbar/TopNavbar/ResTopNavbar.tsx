import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { NavMenu } from "../navbar.types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const socialLinks = [
  {
    id: 1,
    href: "https://facebook.com",
    icon: "/images/facebook.svg",
    label: "Facebook",
  },
  {
    id: 2,
    href: "https://instagram.com",
    icon: "/images/instagram.svg",
    label: "Instagram",
  },
];

const ResTopNavbar = ({ data }: { data: NavMenu }) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <Image
          priority
          src="/icons/menu.svg"
          height={100}
          width={100}
          alt="menu"
          className="max-w-5.5 max-h-5.5"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="overflow-y-auto"
        style={{
          backgroundColor: "#f5f5f5",
          backgroundImage:
            "linear-gradient(rgba(245,245,245,0.99), rgba(245,245,245,0.90)), url('/images/hijeroglofi.svg')",
          backgroundRepeat: "repeat, repeat",
          backgroundSize: "auto, 400% auto",
        }}
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="mb-8">
            <SheetTitle asChild>
              <SheetClose asChild>
                <Link
                  href="/"
                  className="text-2xl font-semibold lg:text-[32px] mr-auto text-brand"
                >
                  FARAON
                </Link>
              </SheetClose>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col">
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "MenuItem" && (
                  <SheetClose asChild>
                    <Link
                      href={item.url ?? "/"}
                      className="mb-4 text-xl font-medium text-black/80"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                )}
                {item.type === "MenuList" && (
                  <div className="mb-4 w-full">
                    <Accordion type="single" collapsible>
                      <AccordionItem value={item.label} className="border-none">
                        <AccordionTrigger className="text-left p-0 py-0.5 text-xl font-medium text-black/80">
                          {item.label}
                        </AccordionTrigger>
                        {/* <AccordionContent className="p-4 pb-0 border-l flex flex-col">
                          {item.children.map((itemChild, idx) => (
                            <SheetClose
                              key={itemChild.id}
                              asChild
                              className="w-fit py-2 text-base text-black/80"
                            >
                              <Link
                                href={itemChild.url ?? "/"}
                                className="text-base"
                              >
                                {itemChild.label}
                              </Link>
                            </SheetClose>
                          ))}
                        </AccordionContent> */}
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="pt-4">
            <div className="flex items-center gap-3 pb-4">
              {socialLinks.map((item) => (
                <SheetClose asChild key={item.id}>
                  <Link href={item.href} aria-label={item.label}>
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={32}
                      height={32}
                    />
                  </Link>
                </SheetClose>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ResTopNavbar;
