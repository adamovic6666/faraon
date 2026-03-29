"use client";

import BreadcrumbCart from "@/components/cart-page/BreadcrumbCart";
import ProductCard from "@/components/cart-page/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { FaArrowRight } from "react-icons/fa6";
import { TbBasketExclamation } from "react-icons/tb";
import React from "react";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks/redux";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/format-price";
import PageLink from "@/components/common/Link";

export default function CartPage() {
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts,
  );

  return (
    <main className="pb-10 md:pb-12 pt-20 md:pt-24">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        {cart && cart.items.length > 0 ? (
          <>
            {/* <BreadcrumbCart /> */}
            <h2
              className={cn([
                integralCF.className,
                "text-[32px] text-brand md:text-5xl uppercase text-center font-semibold pb-10 md:pb-12",
              ])}
            >
              vaša korpa
            </h2>
            <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
              <div className="w-full p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                {cart?.items.map((product, idx, arr) => (
                  <React.Fragment key={idx}>
                    <ProductCard data={product} />
                    {arr.length - 1 !== idx && (
                      <Separator className="bg-black/10" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="w-full lg:max-w-126.25 p-5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                <h6 className="text-xl md:text-2xl font-bold text-black">
                  Pregled porudžbine
                </h6>
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">Međuzbir</span>
                    <span className="md:text-xl font-bold">
                      {formatPrice(totalPrice)} RSD
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">
                      Popust (-
                      {Math.round(
                        ((totalPrice - adjustedTotalPrice) / totalPrice) * 100,
                      )}
                      %)
                    </span>
                    <span className="md:text-xl font-bold text-red-600">
                      -
                      {formatPrice(Math.round(totalPrice - adjustedTotalPrice))}{" "}
                      RSD
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">Dostava</span>
                    <span className="md:text-xl font-bold">Besplatno</span>
                  </div>
                  <Separator className="bg-black/10" />
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black">Ukupno</span>
                    <span className="text-xl md:text-2xl font-bold">
                      {formatPrice(Math.round(adjustedTotalPrice))} RSD
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  className="text-sm md:text-base font-medium bg-brand text-white cursor-pointer hover:bg-brand/90 rounded-full w-full py-4 h-13.5 md:h-15 group"
                >
                  Nastavi na plaćanjem
                  <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-black/80 mt-12 flex flex-col items-center justify-center">
            <TbBasketExclamation strokeWidth={1} className="text-8xl" />
            <span className="block mb-12">Vaša korpa je trenutno prazna.</span>

            <PageLink href="/webshop" className=" flex justify-center">
              Vrati se nazad
            </PageLink>
          </div>
        )}
      </div>
    </main>
  );
}
