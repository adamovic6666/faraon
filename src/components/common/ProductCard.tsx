"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { Product } from "@/types/product.types";
import { useAppDispatch } from "@/lib/hooks/redux";
import {
  addToCart,
  removeCartItem,
  remove,
} from "@/lib/features/carts/cartsSlice";
import { IoCartOutline } from "react-icons/io5";
import { formatPrice } from "@/utils/format-price";

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(0);
  const [qtyInput, setQtyInput] = useState("0");

  const hasDiscount = data.discount !== undefined && data.discount > 0;

  const productHref = `/shop/product/${data.id}/${data.title.split(" ").join("-")}`;

  const applyQuantity = (nextQty: number) => {
    const safeQty = Number.isNaN(nextQty) ? qty : Math.max(0, nextQty);

    if (safeQty === qty) {
      setQtyInput(String(safeQty));
      return;
    }

    if (safeQty === 0) {
      dispatch(remove({ id: data.id, attributes: [], quantity: 1 }));
      setQty(0);
      setQtyInput("0");
      return;
    }

    if (safeQty > qty) {
      const steps = safeQty - qty;
      for (let i = 0; i < steps; i += 1) {
        dispatch(
          addToCart({
            id: data.id,
            name: data.title,
            srcUrl: data.srcUrl,
            price: data.price,
            attributes: [],
            discount: data?.discount ? data.discount : 0,
            quantity: 1,
          }),
        );
      }
    } else {
      const steps = qty - safeQty;
      for (let i = 0; i < steps; i += 1) {
        dispatch(removeCartItem({ id: data.id, attributes: [] }));
      }
    }

    setQty(safeQty);
    setQtyInput(String(safeQty));
  };

  const handleQtyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replaceAll(/\D/g, "");

    if (onlyDigits === "") {
      setQtyInput(onlyDigits);
      return;
    }

    applyQuantity(Number(onlyDigits));
  };

  const commitQtyInput = () => {
    if (qtyInput === "") {
      setQtyInput(String(qty));
      return;
    }

    applyQuantity(Number(qtyInput));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    applyQuantity(1);
  };

  const increment = (e: React.MouseEvent) => {
    e.preventDefault();
    applyQuantity(qty + 1);
  };

  const decrement = (e: React.MouseEvent) => {
    e.preventDefault();
    applyQuantity(qty - 1);
  };

  return (
    <div className="flex flex-col rounded-[20px] border border-gray-100 overflow-hidden shadow-sm bg-white w-full">
      {/* Image */}
      <Link
        href={productHref}
        className="relative block aspect-square w-full bg-section overflow-hidden group"
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
      <div className="flex flex-col p-4 flex-1 bg-accent rounded-2xl overflow-hidden">
        <Link href={productHref}>
          <h3 className="font-semibold text-left text-black text-sm xl:text-base leading-snug mb-4 line-clamp-2 min-h-10">
            {data.title}
          </h3>
        </Link>

        <div className="flex items-end justify-between gap-2 mt-auto flex-wrap ">
          {/* Price */}
          <div className="flex flex-col items-start">
            {hasDiscount && (
              <span className="text-xs text-black/40 line-through mt-0.5">
                {data?.oldPrice ? formatPrice(data.oldPrice) : ""} RSD
              </span>
            )}
            <span className="font-bold text-black text-lg xl:text-xl leading-none">
              {formatPrice(data.price)} RSD
            </span>
          </div>

          {/* Add to cart / Counter */}
          {qty === 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-primary cursor-pointer text-primary-foreground text-sm font-semibold rounded-full px-2.5 py-1.5 hover:brightness-95 active:scale-95 transition whitespace-nowrap"
              aria-label="Dodaj u korpu"
            >
              <IoCartOutline size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-1 text-black bg-white rounded-full p-1">
              <button
                type="button"
                onClick={decrement}
                className="text-xl leading-none cursor-pointer font-medium bg-primary p-1 rounded-full hover:text-brand transition-colors"
                aria-label="Smanji količinu"
              >
                <FaMinus size={14} />
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
                    setQtyInput(String(qty));
                  }
                }}
                className="w-6 text-center text-sm font-medium bg-transparent"
                aria-label="Količina proizvoda u korpi"
              />
              <button
                type="button"
                onClick={increment}
                className="text-xl leading-none cursor-pointer  font-medium bg-primary p-1 rounded-full hover:text-brand transition-colors"
                aria-label="Povećaj količinu"
              >
                <FaPlus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
