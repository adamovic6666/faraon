"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { CategoryItem } from "@/types/category.types";
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
    href: "/prodavnica",
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

const linkClass =
  "whitespace-nowrap rounded-full px-3 py-0.5 md:py-1 transition-colors hover:text-brand md:px-4 text-normal md:text-base xl:text-lg font-normal text-black/80";

interface HeroNavBarProps {
  categories?: CategoryItem[];
}

const HeroNavBar = ({ categories = [] }: HeroNavBarProps) => {
  // Static Akcije link
  const akcije = { id: 1, label: "Akcije", href: "/akcije", highlighted: true };

  // Dynamic category links from API
  const otherLinks =
    categories.length > 0
      ? categories.map((cat, index) => ({
          id: cat.id ?? `${cat.alias}-${index}`,
          label: cat.name,
          href: cat.alias,
        }))
      : [];
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

                {/* Akcije link (static, always first) */}
                <span
                  aria-hidden
                  className="h-4 w-px shrink-0 bg-black/25 hidden xl:block"
                />
                <Link
                  href={akcije.href}
                  className={cn(
                    "shrink-0",
                    linkClass,
                    "bg-brand text-white hover:text-white mr-3 xl:mr-0 py-0.5 md:py-0.5",
                  )}
                >
                  {akcije.label}
                </Link>

                {/* Dynamic category links */}
                {otherLinks.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <span
                      aria-hidden
                      className="h-4 w-px shrink-0 bg-black/25"
                    />
                    <Link
                      href={item.href}
                      className={cn(
                        "shrink-0",
                        linkClass,
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
