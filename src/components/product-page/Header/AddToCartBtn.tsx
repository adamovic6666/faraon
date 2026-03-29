"use client";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { Product } from "@/types/product.types";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const dispatch = useAppDispatch();

  return (
    <Button
      className="ml-3 sm:ml-5 h-11 w-full rounded-full cursor-pointer bg-primary px-6 text-base md:text-lg font-normal text-black/80 shadow-none transition-all hover:bg-primary/85 md:h-13 md:px-10"
      onClick={() =>
        dispatch(
          addToCart({
            id: data.id,
            name: data.title,
            srcUrl: data.srcUrl,
            price: data.price,
            attributes: [],
            discount: data.discount ? data.discount : 0,
            quantity: data.quantity,
          }),
        )
      }
    >
      Dodaj u korpu
    </Button>
  );
};

export default AddToCartBtn;
