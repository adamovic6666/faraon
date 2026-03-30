import * as motion from "framer-motion/client";
import SectionTitle from "./SectionTitle";
import { Product } from "@/types/product.types";
import PageLink from "./Link";
import ProductSwiper from "./ProductSwiper";

type ProductListSecProps = {
  id?: string;
  title: string;
  data: Product[];
  viewAllLink?: string;
  showArrows?: boolean;
  className?: string;
  viewAllVariant?: "primary" | "brand";
  noAnimation?: boolean;
};

const ProductListSec = ({
  id,
  title,
  data,
  viewAllLink,
  showArrows = false,
  className,
  viewAllVariant = "primary",
  noAnimation = false,
}: ProductListSecProps) => {
  return (
    <section id={id} className={className ?? "max-w-frame mx-auto text-center"}>
      <SectionTitle
        title={title}
        className="mb-10 md:mb-12"
        noAnimation={noAnimation}
      />
      <motion.div
        initial={
          noAnimation ? { y: 0, opacity: 1 } : { y: "100px", opacity: 0 }
        }
        whileInView={
          noAnimation ? { y: 0, opacity: 1 } : { y: "0", opacity: 1 }
        }
        viewport={{ once: true }}
        transition={{ delay: noAnimation ? 0 : 0.6, duration: 0.6 }}
      >
        <ProductSwiper data={data} showArrows={showArrows} />
        {viewAllLink && (
          <div className="mt-9 flex justify-center">
            <PageLink
              className="px-4 md:px-0"
              href={viewAllLink}
              variant={viewAllVariant}
            >
              Vidi sve
            </PageLink>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ProductListSec;
