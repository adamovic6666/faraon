"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { Product } from "@/types/product.types";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import { formatPrice } from "@/utils/format-price";
import { toast } from "sonner";

type ProductCardProps = {
  data: Product;
};

const formatPackagingLabel = (value?: string) => {
  if (!value) return "";

  const normalized = value.trim().toLowerCase();
  const literPattern = /^(\d+)_(\d+)_l$/;
  const literMatch = literPattern.exec(normalized);

  if (literMatch) {
    return `${literMatch[1]}.${literMatch[2]} l`;
  }

  return normalized.replaceAll("_", " ");
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [qtyInput, setQtyInput] = useState("1");
  const category = data.category || "bezalkholna-pica";
  const productHref = `/prodavnica/${category}/${data.slug}`;
  const packagingLabel = formatPackagingLabel(data.packaging);
  const getSafeQty = (value: string = qtyInput) => {
    const parsedQty = Number(value);
    if (!Number.isFinite(parsedQty) || parsedQty < 1) return 1;
    return Math.floor(parsedQty);
  };

  const handleQtyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replaceAll(/\D/g, "");
    setQtyInput(onlyDigits);
  };

  const commitQtyInput = () => {
    setQtyInput(String(getSafeQty()));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const quantityToAdd = getSafeQty();

    dispatch(
      addToCart({
        id: data.id,
        name: data.title,
        srcUrl: data.srcUrl,
        price: data.price,
        attributes: [],
        quantity: quantityToAdd,
      }),
    );

    toast.success("Proizvod je dodat u korpu");

    // Normalize the field after submit in case the user left it empty/invalid.
    setQtyInput(String(quantityToAdd));
  };

  const increment = (e: React.MouseEvent) => {
    e.preventDefault();
    setQtyInput(String(getSafeQty() + 1));
  };

  const decrement = (e: React.MouseEvent) => {
    e.preventDefault();
    setQtyInput(String(Math.max(1, getSafeQty() - 1)));
  };
  return (
    <div className="flex flex-col rounded-[20px] border border-black/15 overflow-hidden bg-section  w-full">
      {/* Image */}
      <Link
        href={productHref}
        className="relative block aspect-square w-full overflow-hidden group rounded-xl"
      >
        {packagingLabel ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand/95 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white">
            {packagingLabel}
          </span>
        ) : null}
        <Image
          src={data.srcUrl}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-500"
          alt={data.title}
          priority
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col p-3 md:p-4 flex-1 ">
        <Link href={productHref} className="block">
          <div className="min-h-14 mb-2 md:mb-4">
            <h3 className="text-left text-black text-lg xl:text-xl leading-snug line-clamp-2">
              {data.title}
            </h3>
          </div>
        </Link>

        <div className="flex flex-col items-start justify-between gap-2 mt-auto">
          {/* Price */}
          <div className="flex flex-col items-start">
            {data?.oldPrice && data.oldPrice > data.price && (
              <span className="text-md text-black/40 mt-0.5 relative">
                {formatPrice(data.oldPrice)}{" "}
                <span className="text-[10px]">RSD</span>
                {/* Line though custom */}
                <span className="absolute inset-0 bg-black/15 h-0.5 top-1/2 transform -translate-y-1/2 z-1"></span>
              </span>
            )}
            <span className="font-bold text-black text-2xl leading-none">
              {formatPrice(data?.price)} <span className="text-xs">RSD</span>
            </span>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex w-full items-center gap-1 md:gap-2 bg-white rounded-full justify-between p-0.5 md:p-1 md:mt-auto">
            <div className="flex items-center justify-between rounded-full bg-white p-0.5 w-16 md:w-22">
              <button
                type="button"
                onClick={decrement}
                className="leading-none cursor-pointer p-1 rounded-full border border-black/40 hover:bg-black/5 transition-colors"
                aria-label="Smanji količinu"
              >
                <FaMinus size={10} />
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={qtyInput}
                onChange={handleQtyInputChange}
                onBlur={commitQtyInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitQtyInput();
                  }
                  if (e.key === "Escape") {
                    setQtyInput("1");
                  }
                }}
                className="w-6 text-center text-sm font-medium bg-transparent outline-none"
                aria-label="Količina proizvoda za dodavanje u korpu"
              />
              <button
                type="button"
                onClick={increment}
                className="leading-none cursor-pointer p-1 rounded-full border border-black/40 hover:bg-black/5 transition-colors"
                aria-label="Povećaj količinu"
              >
                <FaPlus size={10} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-primary shadow-none text-black/80 text-sm rounded-full uppercase px-4 md:px-6 py-1 md:py-1.5 hover:bg-primary/85 transition whitespace-nowrap inline-flex items-center justify-center shrink-0"
              aria-label="Dodaj u korpu"
            >
              <span className="hidden md:block"> Dodaj u korpu</span>

              <Image
                priority
                src="/icons/cart.svg"
                height={100}
                width={100}
                alt="cart"
                className="w-4 h-4 md:hidden"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
