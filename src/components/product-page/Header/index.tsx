import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import AddToCardSection from "./AddToCardSection";
import ProductGallery from "./ProductGallery";
import { formatPrice } from "@/utils/format-price";

const Header = ({
  data,
  showOnlyMainImage = false,
}: {
  data: Product;
  showOnlyMainImage?: boolean;
}) => {
  const hasDiscount = data.discount !== undefined && data.discount > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-stretch">
      <ProductGallery
        title={data.title}
        srcUrl={data.srcUrl}
        discount={data.discount}
        showOnlyMainImage={showOnlyMainImage}
      />

      <div className="flex min-h-full flex-col md:min-h-0">
        <h1
          className={cn([
            integralCF.className,
            "text-2xl text-black/80 md:text-[40px] leading-8 md:leading-11 mb-3 md:mb-3.5 max-w-120",
          ])}
        >
          {data.title}
        </h1>
        <div className="flex flex-row md:flex-col gap-3 md:gap-2 justify-start items-end md:items-start">
          <p className="font-bold text-black text-4xl leading-none sm:text-5xl">
            {formatPrice(data.price)}
            <span className="text-sm ml-0.5">RSD</span>
          </p>
          {hasDiscount && data.oldPrice ? (
            <span className="relative w-fit text-lg text-black/40">
              {formatPrice(data.oldPrice)} <span className="text-xs">RSD</span>
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-black/20" />
            </span>
          ) : null}
        </div>

        {data.description ? (
          <p className="text-md font-light text-black/60 mt-8 mb-5 max-w-160 md:max-h-48 md:overflow-y-auto md:pr-1">
            {data.description}
          </p>
        ) : null}

        <div className="mt-4 md:mt-auto flex flex-col gap-3">
          <AddToCardSection data={data} />
        </div>
      </div>
    </div>
  );
};

export default Header;
