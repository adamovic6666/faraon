"use client";

import { useRef, useState } from "react";
import { Product } from "@/types/product.types";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import type { Swiper as SwiperType } from "swiper/types";
import "swiper/css";

type ProductSwiperProps = {
  data: Product[];
  showArrows?: boolean;
};

const ProductSwiper = ({ data, showArrows = false }: ProductSwiperProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const minLoopSlides = 8;
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!data.length) return null;

  const loopSlides =
    data.length > 1 && data.length < minLoopSlides
      ? Array.from(
          { length: minLoopSlides },
          (_, index) => data[index % data.length],
        )
      : data;

  const canLoop = loopSlides.length > 1;
  const canShowArrows = showArrows && canLoop;

  const handlePrev = () => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.isBeginning) return;
    swiper.slideTo(Math.max(swiper.activeIndex - 1, 0));
  };

  const handleNext = () => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.isEnd) return;
    swiper.slideTo(Math.min(swiper.activeIndex + 1, swiper.slides.length - 1));
  };

  return (
    <div className="relative">
      {canShowArrows && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            disabled={isBeginning}
            aria-label="Prethodni proizvod"
            className="hidden md:flex absolute left-0 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-primary text-black items-center justify-center shadow-sm hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoIosArrowBack size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isEnd}
            aria-label="Sledeci proizvod"
            className="hidden md:flex absolute right-0 top-1/2 z-40 translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-primary text-black items-center justify-center shadow-sm hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoIosArrowForward size={18} aria-hidden="true" />
          </button>
        </>
      )}

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        slidesPerView="auto"
        slidesPerGroup={1}
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
        className="w-full mb-4 md:mb-9"
      >
        {loopSlides.map((product, index) => (
          <SwiperSlide
            key={`${product.id}-${index}`}
            className="w-52! sm:w-77!"
          >
            <ProductCard data={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      {canShowArrows && (
        <div className="flex md:hidden items-center justify-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isBeginning}
            aria-label="Prethodni proizvod"
            className="h-9 w-9 rounded-full bg-primary text-black flex items-center justify-center shadow-sm hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoIosArrowBack size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isEnd}
            aria-label="Sledeci proizvod"
            className="h-9 w-9 rounded-full bg-primary text-black flex items-center justify-center shadow-sm hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoIosArrowForward size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSwiper;
