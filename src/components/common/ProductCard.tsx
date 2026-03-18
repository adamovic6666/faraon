"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { Product } from "@/types/product.types";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import { IoCartOutline } from "react-icons/io5";
import { formatPrice } from "@/utils/format-price";

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [qtyInput, setQtyInput] = useState("1");

  const hasDiscount = data.discount !== undefined && data.discount > 0;

  const productHref = `/shop/product/${data.id}/${data.title.split(" ").join("-")}`;

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
        discount: data?.discount ? data.discount : 0,
        quantity: quantityToAdd,
      }),
    );

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
    <div className="flex flex-col   rounded-[20px] border border-black/10 overflow-hidden bg-section  w-full">
      {/* Image */}
      <Link
        href={productHref}
        className="relative block aspect-square w-full overflow-hidden group rounded-xl"
      >
        <Image
          src={data.srcUrl}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-500"
          alt={data.title}
          priority
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-brand text-white text-xs font-bold rounded-full px-2.5 py-1.5 leading-none">
            -{data.discount}%
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col p-4 flex-1 ">
        <Link href={productHref}>
          <h3 className="font-semibold text-left text-black text-sm xl:text-base leading-snug mb-3 md:mb-6 line-clamp-2 min-h-10">
            {data.title}
          </h3>
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mt-auto">
          {/* Price */}
          <div className="flex flex-col items-start">
            {hasDiscount && (
              <span className="text-xs text-black/40 line-through mt-0.5">
                {data?.oldPrice ? formatPrice(data.oldPrice) : ""}{" "}
                <span>rsd</span>
              </span>
            )}
            <span className="font-bold text-black text-md leading-none">
              {formatPrice(data.price)} <span>rsd</span>
            </span>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex w-full md:w-auto items-center gap-2 rounded-xl md:max-w-60 justify-between mt-1 md:mt-auto">
            <div className="flex items-center justify-between rounded-xl bg-white p-1 w-24 md:w-auto">
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
                className="w-8 md:w-6 text-center text-sm font-medium bg-transparent outline-none"
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
              className="bg-primary text-white text-sm font-semibold rounded-lg  px-2.5 py-1.5 hover:bg-primary/85 transition whitespace-nowrap inline-flex items-center justify-center"
              aria-label="Dodaj u korpu"
            >
              <IoCartOutline size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
