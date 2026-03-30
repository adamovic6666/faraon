"use client";

import React, { useState } from "react";
import AddToCartBtn from "./AddToCartBtn";
import { Product } from "@/types/product.types";
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCardSection = ({ data }: { data: Product }) => {
  const [qtyInput, setQtyInput] = useState("1");

  const getSafeQty = (value: string = qtyInput) => {
    const parsedQty = Number(value);
    if (!Number.isFinite(parsedQty) || parsedQty < 1) return 1;
    return Math.floor(parsedQty);
  };

  const commitQtyInput = () => {
    setQtyInput(String(getSafeQty()));
  };

  return (
    <div className="flex h-auto w-full items-center rounded-full border border-black/15 bg-section p-1 sm:w-fit">
      <div className="flex min-w-22 items-center justify-between rounded-full p-1 pr-3">
        <button
          type="button"
          onClick={() => setQtyInput(String(Math.max(1, getSafeQty() - 1)))}
          className="leading-none bg-white   cursor-pointer rounded-full border border-black/15 p-2 transition-colors hover:bg-black/5"
          aria-label="Smanji količinu"
        >
          <FaMinus size={12} />
        </button>

        <input
          type="text"
          inputMode="numeric"
          value={qtyInput}
          onChange={(e) => setQtyInput(e.target.value.replaceAll(/\D/g, ""))}
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
          className="w-8 md:w-10 text-center text-sm font-medium bg-transparent outline-none"
          aria-label="Količina proizvoda za dodavanje u korpu"
        />

        <button
          type="button"
          onClick={() => setQtyInput(String(getSafeQty() + 1))}
          className="leading-none bg-white  cursor-pointer rounded-full border border-black/15 p-2 transition-colors hover:bg-black/5"
          aria-label="Povećaj količinu"
        >
          <FaPlus size={12} />
        </button>
      </div>

      <AddToCartBtn data={{ ...data, quantity: getSafeQty() }} />
    </div>
  );
};

export default AddToCardSection;
