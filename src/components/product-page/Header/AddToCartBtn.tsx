"use client";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { Product } from "@/types/product.types";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const dispatch = useAppDispatch();

  return (
    <Button
      className="h-12 min-w-52 shrink-0 rounded-full bg-brand px-10 text-center text-base md:text-lg font-medium text-white transition-all hover:bg-brand/90 md:h-13 md:min-w-60 md:px-14 md:text-xl"
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
