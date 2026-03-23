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
  { title: "Prodavnica", href: "/" },
  { title: "Diskonti", href: "/" },
  { title: "Kontakt", href: "/" },
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
  "whitespace-nowrap rounded-full px-3 py-0.5 md:py-1 transition-colors hover:text-brand md:px-4 text-lg font-normal text-black/80";

const HeroNavBar = () => {
  return (
    <div className="fixed inset-x-0 top-18 z-100 border-t border-black/10 bg-primary shadow-xs md:top-22">
      <div className="relative mx-auto max-w-frame md:px-4 lg:px-0">
        <div className="hero-category-scroll mx-auto flex h-12 max-w-frame items-center overflow-x-auto scrollbar-none md:h-14 md:overflow-visible">
          {/* Single row: scrollable on mobile, justify-between on desktop.
            Meni lives inside the same flex so every separator gap receives
            the same extra space from justify-between — no more unequal
            Meni→Akcije spacing. */}
          <div className="hero-category-bar relative min-w-0 flex-1">
            <div>
              <div
                className="flex w-max min-w-full items-center pl-4 pr-8 md:w-full md:min-w-0 md:pl-0 md:pr-0 md:justify-between"
                data-mobile-category-scroll
              >
                {/* Meni dropdown — desktop only, first item in the justified row */}
                <NavigationMenu className="hidden md:flex shrink-0 flex-none! max-w-none!">
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
                        index === 0 && "hidden md:block",
                      )}
                    />
                    <Link
                      href={item.href}
                      className={cn(
                        "shrink-0",
                        linkClass,
                        item.highlighted &&
                          "bg-brand text-white hover:text-white mr-3 md:mr-0",
                        index === otherLinks.length - 1 && "md:pr-0",
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
          className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-linear-to-l from-primary via-primary/92 to-transparent md:hidden"
        />
      </div>
    </div>
  );
};

export default HeroNavBar;
