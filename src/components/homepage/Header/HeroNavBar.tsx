"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
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
    href: "/webshop",
    description: "Online prodavnica pića sa brzom dostavom",
  },
  {
    title: "Diskonti",
    href: "/lokacije",
    description: "Pronađi najbliži Faraon diskont u tvojoj okolini",
  },
  {
    title: "Kontakt",
    href: "/kontakt",
    description: "Kontaktirajte nas za sva pitanja i porudžbine",
  },
];

const otherLinks = [
  { id: 2, label: "Akcije", href: "/", highlighted: true },
  { id: 3, label: "Bezalkoholna pića", href: "/webshop/bezalkholna-pica" },
  { id: 4, label: "Žestoka alkoholna pića", href: "/" },
  { id: 5, label: "Piva", href: "/" },
  { id: 6, label: "Vina", href: "/" },
  { id: 7, label: "Vode", href: "/" },
  { id: 8, label: "Čajevi, kafe i napici", href: "/" },
  { id: 9, label: "Sirupi i likeri", href: "/" },
  { id: 10, label: "Led", href: "/" },
];

const linkClass =
  "whitespace-nowrap rounded-full px-3 py-0.5 md:py-1 transition-colors hover:text-brand md:px-4 text-normal md:text-base xl:text-lg font-normal text-black/80";

const HeroNavBar = () => {
  return (
    <div className="fixed inset-x-0 top-16 z-80 border-t border-black/10 bg-primary shadow-xs">
      <div className="relative mx-auto max-w-frame md:px-4 lg:px-0">
        <div className="hero-category-scroll mx-auto flex h-10 max-w-frame items-center overflow-x-auto scrollbar-none md:h-11 xl:h-12 xl:overflow-visible">
          {/* Single row: scrollable on mobile, justify-between on desktop.
            Meni lives inside the same flex so every separator gap receives
            the same extra space from justify-between — no more unequal
            Meni→Akcije spacing. */}
          <div className="hero-category-bar relative min-w-0 flex-1">
            <div>
              <div
                className="flex w-max min-w-full items-center pl-4 pr-8 xl:w-full xl:min-w-0 xl:pl-0 xl:pr-0 xl:justify-between"
                data-mobile-category-scroll
              >
                {/* Meni dropdown — desktop only, first item in the justified row */}
                <NavigationMenu className="hidden xl:flex shrink-0 flex-none! max-w-none!">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger
                        className={cn(
                          linkClass,
                          "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent h-auto px-0 pl-0!",
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
                                <p className="text-base text-black/80 leading-snug">
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

                {otherLinks.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {/* Separator before every link.
                        index=0 (before Akcije): desktop-only — sits between Meni and Akcije.
                        index>0: always visible on both mobile and desktop. */}
                    <span
                      aria-hidden
                      className={cn(
                        "h-4 w-px shrink-0 bg-black/25",
                        index === 0 && "hidden xl:block",
                      )}
                    />
                    <Link
                      href={item.href}
                      className={cn(
                        "shrink-0",
                        linkClass,
                        item.highlighted &&
                          "bg-brand text-white hover:text-white mr-3 xl:mr-0 py-0.5 md:py-0.5",
                        index === otherLinks.length - 1 && "xl:pr-0",
                      )}
                    >
                      {item.label}
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right-edge fade — mobile only, fixed to the visible strip edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-primary via-primary/92 to-transparent xl:hidden"
        />
      </div>
    </div>
  );
};

export default HeroNavBar;
