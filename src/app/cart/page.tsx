"use client";

import ProductCard from "@/components/cart-page/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { TbBasketExclamation } from "react-icons/tb";
import React from "react";
import { RootState } from "@/lib/store";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/format-price";
import PageLink from "@/components/common/Link";
import { clearCart } from "@/lib/features/carts/cartsSlice";
import Link from "next/link";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts,
  );
  const discountPercentage =
    totalPrice > 0
      ? Math.round(((totalPrice - adjustedTotalPrice) / totalPrice) * 100)
      : 0;

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
              <div className="w-full flex-col px-4 rounded-[20px] overflow-hidden border border-black/15">
                {cart?.items.map((product, idx, arr) => (
                  <React.Fragment key={idx}>
                    <ProductCard data={product} />
                    {arr.length - 1 !== idx && (
                      <Separator className="bg-black/15 md:my-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="w-full lg:max-w-132 p-5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/15">
                <h6 className="text-xl md:text-2xl font-bold text-black">
                  Pregled porudžbine
                </h6>
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg text-black/60">
                      Broj artikala
                    </span>
                    <span className="text-base md:text-lg font-semibold text-black/80">
                      {cart.totalQuantities}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg text-black/60">
                      Međuzbir
                    </span>
                    <span className="text-base md:text-lg font-semibold text-black/80">
                      {formatPrice(totalPrice)}{" "}
                      <span className="text-sm">RSD</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg text-black/60">
                      Popust (-{discountPercentage}%)
                    </span>
                    <span className="text-base md:text-lg font-semibold text-brand">
                      -
                      {formatPrice(Math.round(totalPrice - adjustedTotalPrice))}{" "}
                      <span className="text-sm">RSD</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg text-black/60">
                      Dostava
                    </span>
                    <span className="text-base md:text-lg font-semibold text-black/80">
                      Besplatno
                    </span>
                  </div>
                  <Separator className="bg-black/15" />
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg text-black/60">
                      Ukupno
                    </span>

                    <span className="text-xl md:text-2xl font-bold">
                      {formatPrice(Math.round(adjustedTotalPrice))}{" "}
                      <span className="text-sm">RSD</span>
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-base md:text-lg shadow-none uppercase font-medium border-black/15 text-black/80 cursor-pointer hover:bg-brand hover:border-brand hover:text-white rounded-full w-full py-4 h-13.5 md:h-15"
                    onClick={() => dispatch(clearCart())}
                  >
                    Isprazni korpu
                  </Button>
                  <Link
                    href="/korpa/checkout"
                    className="inline-flex w-full items-center justify-center rounded-full bg-primary py-4 text-base font-medium uppercase text-black/80 transition-colors hover:bg-primary/90 md:h-15 md:text-lg"
                  >
                    Nastavi sa plaćanjem
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-black/80 mt-12 flex flex-col items-center justify-center">
            <TbBasketExclamation strokeWidth={1} className="text-8xl" />
            <span className="block mb-12">Vaša korpa je trenutno prazna.</span>

            <PageLink href="/prodavnica" className=" flex justify-center">
              Vrati se nazad
            </PageLink>
          </div>
        )}
      </div>
    </main>
  );
}
