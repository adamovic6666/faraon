"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const menuDropdownItems = [
  {
    title: "Prodavnica",
    description: "Online prodavnica pića sa brzom dostavom",
    href: "/#online-prodavnica",
  },
  {
    title: "Diskonti",
    description: "Pronađi najbliži Faraon diskont u tvojoj okolini",
    href: "/#faraon-diskonti",
  },
  {
    title: "Kontakt",
    description: "Kontaktirajte nas za sva pitanja i porudžbine",
    href: "/#kontakt",
  },
];

const otherLinks = [
  { id: 2, label: "Akcije", href: "/", highlighted: true },
  { id: 3, label: "Bezalkoholna pića", href: "/" },
  { id: 4, label: "Žestoka alkoholna pića", href: "/" },
  { id: 5, label: "Piva", href: "/" },
  { id: 6, label: "Vina", href: "/" },
  { id: 7, label: "Vode", href: "/" },
  { id: 8, label: "Čajevi, kafe i napici", href: "/" },
  { id: 9, label: "Sirupi i likeri", href: "/" },
  { id: 10, label: "Led", href: "/" },
];

const linkClass =
  "whitespace-nowrap rounded-full px-3 py-1 transition-colors hover:text-brand md:px-4 text-lg font-normal text-black/80";

const HeroNavBar = () => {
  return (
    <div className="fixed inset-x-0 top-18 z-100 border-t border-black/10 bg-primary shadow-xs md:top-22">
      <div className="mx-auto flex h-12 max-w-frame items-center px-4 md:h-14 md:px-4 lg:px-0">
        <div className="flex w-full items-center justify-between">
          <NavigationMenu className="shrink-0 flex-none! max-w-none!">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    linkClass,
                    "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent h-auto",
                  )}
                >
                  Meni
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-64 p-2">
                    {menuDropdownItems.map((item) => (
                      <li key={item.title}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-black/5"
                        >
                          <p className="text-base font-semibold text-black leading-snug">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-sm font-light text-black/55 leading-snug">
                            {item.description}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {otherLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "shrink-0",
                linkClass,
                item.highlighted && "bg-brand text-white hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroNavBar;
