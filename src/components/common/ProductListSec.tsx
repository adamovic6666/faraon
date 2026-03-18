import * as motion from "framer-motion/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";
import { Product } from "@/types/product.types";
import Link from "next/link";

type ProductListSecProps = {
  title: string;
  data: Product[];
  viewAllLink?: string;
};

const ProductListSec = ({ title, data, viewAllLink }: ProductListSecProps) => {
  return (
    <section className="max-w-frame mx-auto text-center">
      <SectionTitle title={title} className="mb-8 md:mb-12" />
      <motion.div
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full mb-6 md:mb-9"
        >
          <CarouselContent className="mx-4 xl:mx-0 space-x-4 sm:space-x-5">
            {data.map((product) => (
              <CarouselItem
                key={product.id}
                className="w-full max-w-49.5 sm:max-w-68 pl-0"
              >
                <ProductCard data={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {viewAllLink && (
          <div className="mt-7 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-8 py-2 font-semibold hover:brightness-95 transition-all"
            >
              Vidi sve
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ProductListSec;
