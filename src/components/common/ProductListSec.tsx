import * as motion from "framer-motion/client";
import SectionTitle from "./SectionTitle";
import { Product } from "@/types/product.types";
import PageLink from "./Link";
import ProductSwiper from "./ProductSwiper";

type ProductListSecProps = {
  title: string;
  data: Product[];
  viewAllLink?: string;
  showArrows?: boolean;
};

const ProductListSec = ({
  title,
  data,
  viewAllLink,
  showArrows = false,
}: ProductListSecProps) => {
  return (
    <section className="max-w-frame mx-auto text-center">
      <SectionTitle title={title} className="mb-8 md:mb-12" />
      <motion.div
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <ProductSwiper data={data} showArrows={showArrows} />
        {viewAllLink && (
          <div className="mt-7 flex justify-center">
            <PageLink className="px-4 md:px-0 " href={viewAllLink}>
              Vidi sve
            </PageLink>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ProductListSec;
