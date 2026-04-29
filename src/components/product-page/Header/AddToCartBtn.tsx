"use client";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { Product } from "@/types/product.types";
import { toast } from "sonner";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const dispatch = useAppDispatch();

  return (
    <Button
      className="h-12 min-w-52 shrink-0 shadow-none rounded-full bg-primary text-black/80 hover:bg-primary/85 px-10 text-center text-base md:text-lg font-medium transition-all cursor-pointer md:h-13 md:min-w-60 md:px-14 uppercase"
      onClick={() => {
        dispatch(
          addToCart({
            id: data.id,
            name: data.title,
            srcUrl: data.srcUrl,
            price: data.price,
            attributes: [],
            quantity: data.quantity,
          }),
        );
        toast.success("Proizvod je dodat u korpu");
      }}
    >
      Dodaj u korpu
    </Button>
  );
};

export default AddToCartBtn;
