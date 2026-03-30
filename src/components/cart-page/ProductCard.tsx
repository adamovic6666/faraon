"use client";

import { PiTrashFill } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  addToCart,
  CartItem,
  remove,
  removeCartItem,
} from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { formatPrice } from "@/utils/format-price";

type ProductCardProps = {
  data: CartItem;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const itemTotal = data.price * data.quantity;

  const increment = () => {
    dispatch(
      addToCart({
        ...data,
        quantity: 1,
      }),
    );
  };

  const decrement = () => {
    dispatch(
      removeCartItem({
        id: data.id,
        attributes: data.attributes,
      }),
    );
  };

  return (
    <>
      <div className="md:hidden relative">
        <div className="flex py-4">
          <Link
            href={`/`}
            className="bg-[#F0EEED] rounded-lg w-22 h-22 shrink-0 overflow-hidden"
          >
            <Image
              src={data.srcUrl}
              width={124}
              height={124}
              className="rounded-md w-full h-full object-cover"
              alt={data.name}
              priority
            />
          </Link>

          <div className="min-w-0 flex flex-col pl-2 gap-4 w-full relative">
            <Link
              href={`/`}
              className="text-left text-black/80 leading-snug line-clamp-2 max-w-40"
            >
              {data.name}
            </Link>
            <div className="flex gap-2 w-full items-center justify-between mt-auto">
              <p className="font-bold text-black text-xl leading-none mt-1">
                {formatPrice(data.price)} <span className="text-xs">RSD</span>
              </p>
              <div className="flex w-full items-center gap-1 bg-section rounded-full justify-between px-1 py-0.5 max-w-20 border border-black/15">
                <button
                  type="button"
                  onClick={decrement}
                  className="leading-none cursor-pointer rounded-full border border-black/40 bg-white p-0.5 transition-colors hover:bg-black/5"
                  aria-label="Smanji količinu proizvoda"
                >
                  <FaMinus size={10} />
                </button>

                <span className="w-6 text-center text-sm font-semibold">
                  {data.quantity}
                </span>

                <button
                  type="button"
                  onClick={increment}
                  className="leading-none cursor-pointer rounded-full border border-black/40 bg-white p-0.5 transition-colors hover:bg-black/5"
                  aria-label="Povećaj količinu proizvoda"
                >
                  <FaPlus size={10} />
                </button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 absolute -right-2 -top-1.5 rounded-full"
              onClick={() =>
                dispatch(
                  remove({
                    id: data.id,
                    attributes: data.attributes,
                    quantity: data.quantity,
                  }),
                )
              }
            >
              <PiTrashFill className="text-xl text-brand" />
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-[120px_minmax(0,1fr)_200px] gap-5 items-start py-4">
        <Link
          href={`/`}
          className="bg-[#F0EEED] rounded-lg w-full aspect-square overflow-hidden"
        >
          <Image
            src={data.srcUrl}
            width={124}
            height={124}
            className="rounded-md w-full h-full object-cover hover:scale-110 transition-all duration-500"
            alt={data.name}
            priority
          />
        </Link>

        <div className="min-w-0 flex flex-col h-full">
          <Link href={`/`} className="text-black font-bold text-xl">
            {data.name}
          </Link>
          <p className="text-lg font-medium text-black/80 mt-2">
            {formatPrice(itemTotal)} <span className="text-sm">RSD</span>
          </p>
        </div>

        <div className="flex min-h-full flex-col items-end justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() =>
              dispatch(
                remove({
                  id: data.id,
                  attributes: data.attributes,
                  quantity: data.quantity,
                }),
              )
            }
          >
            <PiTrashFill className="text-2xl text-brand" />
          </Button>
          <div className="flex items-center gap-2 rounded-3xl bg-section p-1.5 border border-black/15">
            <button
              type="button"
              onClick={decrement}
              className="leading-none cursor-pointer bg-white rounded-full border border-black/40 p-1 transition-colors hover:bg-black/5"
              aria-label="Smanji količinu proizvoda"
            >
              <FaMinus size={10} />
            </button>

            <span className="w-6 text-center text-sm font-semibold">
              {data.quantity}
            </span>

            <button
              type="button"
              onClick={increment}
              className="leading-none cursor-pointer bg-white rounded-full border border-black/40 p-1 transition-colors hover:bg-black/5"
              aria-label="Povećaj količinu proizvoda"
            >
              <FaPlus size={10} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
