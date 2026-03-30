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

      <div className="flex min-h-full flex-col">
        <h1
          className={cn([
            integralCF.className,
            "text-2xl text-black/80 md:text-[40px] md:leading-10 mb-3 md:mb-3.5 max-w-120",
          ])}
        >
          {data.title}
        </h1>

        {data.description ? (
          <p className="text-sm sm:text-base text-black/60 mt-1 mb-5">
            {data.description}
          </p>
        ) : null}

        <div className="mt-4 md:mt-auto flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            {hasDiscount && data.oldPrice ? (
              <span className="relative w-fit text-lg text-black/40">
                {formatPrice(data.oldPrice)}{" "}
                <span className="text-xs">RSD</span>
                <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-black/20" />
              </span>
            ) : null}

            <p className="font-bold text-black text-4xl leading-none sm:text-5xl">
              {formatPrice(data.price)}
              <span className="text-sm ml-0.5">RSD</span>
            </p>
          </div>

          <AddToCardSection data={data} />
        </div>
      </div>
    </div>
  );
};

export default Header;
