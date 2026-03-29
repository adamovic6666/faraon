import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import AddToCardSection from "./AddToCardSection";
import ProductGallery from "./ProductGallery";
import { formatPrice } from "@/utils/format-price";

const Header = ({ data }: { data: Product }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-stretch">
      <ProductGallery title={data.title} srcUrl={data.srcUrl} />

      <div className="flex min-h-full flex-col">
        <h1
          className={cn([
            integralCF.className,
            "text-2xl text-brand md:text-[40px] md:leading-10 mb-3 md:mb-3.5 max-w-120",
          ])}
        >
          {data.title}
        </h1>

        <p className="font-bold text-black text-2xl sm:text-[32px]">
          {formatPrice(data.price)} <span className="text-xs">RSD</span>
        </p>

        {data.description ? (
          <p className="text-sm sm:text-base text-black/60 mb-5">
            {data.description}
          </p>
        ) : null}

        <div className="mt-auto">
          <AddToCardSection data={data} />
        </div>
      </div>
    </div>
  );
};

export default Header;
