import { IoCartOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";
import { Badge } from "../ui/badge";

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  return (
    <Link
      href={`/shop/product/${data.id}/${data.title.split(" ").join("-")}`}
      className="flex flex-col items-start aspect-auto border border-gray-200 rounded-[13px] lg:rounded-[20px] relative"
    >
      <div className="rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 overflow-hidden">
        <Image
          src={data.srcUrl}
          width={295}
          height={298}
          className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
          alt={data.title}
          priority
        />
      </div>
      <Badge
        variant="outline"
        className="absolute top-2 left-2 bg-brand text-white rounded-full px-2 py-1 text-xs xl:text-sm"
      >
        {data.discount.percentage > 0 && `-${data.discount.percentage}%`}
      </Badge>
      <div className="px-4 pb-4 w-full">
        <strong className="text-black xl:text-xl text-left mb-8 block min-h-[64px]">
          {data.title}
        </strong>
        <div className="flex justify-between w-full items-center">
          <div className="flex flex-col items-start space-x-1 xl:space-x-2.5 mb-2">
            {data.oldPrice && (
              <span className="font-bold text-black/40 line-through text-md">
                {data.oldPrice} RSD
              </span>
            )}
            {data.price && (
              <span className="font-bold text-black text-xl xl:text-2xl">
                {data.price} RSD
              </span>
            )}
          </div>
          <div className="bg-gold text-amber-900 rounded-full p-2">
            <IoCartOutline size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
