"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { NavMenu } from "../navbar.types";
import {
  Accordion,
  AccordionContent,
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
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.dataset.mobileNavOpen = open ? "true" : "false";

    return () => {
      delete document.body.dataset.mobileNavOpen;
    };
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex h-5.5 w-5.5 items-center justify-center cursor-pointer p-0"
          aria-label={open ? "Zatvori meni" : "Otvori meni"}
        >
          {open ? (
            <Cross2Icon className="h-5.5 w-5.5 text-black" />
          ) : (
            <Image
              priority
              src="/icons/menu.svg"
              height={100}
              width={100}
              alt="menu"
              className="max-w-5.5 max-h-5.5"
            />
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="top-17 bottom-0 z-200 h-auto! w-screen! max-w-none! border-r-0! bg-white! p-0! overflow-y-auto [&>button]:hidden"
      >
        <div className="flex h-full flex-col px-6 pb-6 pt-8">
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
                        <AccordionTrigger className="text-left p-0 py-0.5 text-xl font-medium text-black/80 hover:no-underline">
                          {item.label}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-0">
                          <div className="flex flex-col border-l border-black/15 pl-4">
                            {item.children.map((itemChild) => (
                              <SheetClose
                                key={itemChild.id}
                                asChild
                                className="w-fit py-1.5 text-lg text-black/75"
                              >
                                <Link
                                  href={itemChild.url ?? "/"}
                                  className="text-lg"
                                >
                                  {itemChild.label}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </AccordionContent>
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
