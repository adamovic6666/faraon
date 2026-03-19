"use client";

import { Product } from "@/types/product.types";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type ProductSwiperProps = {
  data: Product[];
};

const ProductSwiper = ({ data }: ProductSwiperProps) => {
  if (!data.length) return null;

  return (
    <Swiper
      loop={data.length > 1}
      slidesPerView="auto"
      spaceBetween={16}
      slidesOffsetBefore={16}
      slidesOffsetAfter={16}
      breakpoints={{
        640: {
          spaceBetween: 20,
          slidesOffsetBefore: 20,
          slidesOffsetAfter: 20,
        },
        1280: {
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0,
        },
      }}
      className="w-full mb-6 md:mb-9"
    >
      {data.map((product) => (
        <SwiperSlide key={product.id} className="w-52! sm:w-76!">
          <ProductCard data={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductSwiper;
