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
            "text-2xl text-black/80 md:text-[40px] leading-8 md:leading-11 mb-4 md:mb-6 max-w-120",
          ])}
        >
          {data.title}
        </h1>
        <div className="flex flex-row gap-3 items-end">
          <p className="font-bold text-black text-4xl leading-none sm:text-5xl">
            {formatPrice(data.price)}
            <span className="text-sm ml-0.5 leading-none">RSD</span>
          </p>
          {hasDiscount && data.oldPrice ? (
            <span className="relative w-fit text-lg text-black/40 leading-none md:-translate-y-0.5">
              {formatPrice(data.oldPrice)}{" "}
              <span className="text-xs leading-none">RSD</span>
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-black/20" />
            </span>
          ) : null}
        </div>

        <div className="flex flex-col-reverse md:flex-col h-full">
          {data.description ? (
            <p className="text-md font-light text-black/60 mt-6 mb-0 md:mb-3 max-w-160 max-h-72 md:max-h-54 overflow-y-auto md:pr-1">
              {data.description}
            </p>
          ) : null}

          <div className="mt-8 mb-4 md:mt-auto md:mb-0 flex flex-col gap-3">
            <AddToCardSection data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
