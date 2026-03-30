"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  title: string;
  srcUrl: string;
  discount?: number;
  showOnlyMainImage?: boolean;
};

const ProductGallery = ({
  title,
  srcUrl,
  discount,
  showOnlyMainImage = false,
}: ProductGalleryProps) => {
  const images = useMemo(
    () =>
      showOnlyMainImage
        ? [{ id: "img-1", src: srcUrl }]
        : [
            { id: "img-1", src: srcUrl },
            { id: "img-2", src: srcUrl },
            { id: "img-3", src: srcUrl },
            { id: "img-4", src: srcUrl },
          ],
    [showOnlyMainImage, srcUrl],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen]);

  const thumbnails = (
    <>
      {images.slice(0, 3).map((img, index) => (
        <button
          key={img.id}
          type="button"
          aria-label={`Slika ${index + 1}`}
          className={cn(
            "relative aspect-square w-full overflow-hidden rounded-xl border shrink-0 border-black/15 hover:border-black/25",
          )}
          onClick={() => setActiveIndex(index)}
        >
          <Image
            src={img.src}
            alt={`${title} - pregled ${index + 1}`}
            fill
            className="object-contain"
          />
        </button>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile: main image on top, 3 thumbnails below */}
      <div className="flex flex-col gap-3 md:hidden">
        <button
          type="button"
          className="relative aspect-square w-full overflow-hidden rounded-2xl border border-black/15"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={images[activeIndex].src}
            alt={title}
            fill
            priority
            className="object-contain"
          />
          {discount && discount > 0 ? (
            <span className="absolute right-3 top-3 rounded-full bg-brand px-2.5 py-1 text-xs font-bold leading-none text-white">
              -{discount}%
            </span>
          ) : null}
        </button>
        {images.length > 1 ? (
          <div className="grid grid-cols-3 gap-3">
            {images.slice(0, 3).map((img, index) => (
              <button
                key={img.id}
                type="button"
                aria-label={`Slika ${index + 1}`}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border border-black/15 hover:border-black/25",
                )}
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  src={img.src}
                  alt={`${title} - pregled ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop: thumbnails column on the left, main image on the right */}
      <div className="hidden md:flex gap-4 items-start">
        {images.length > 1 ? (
          <div className="flex flex-col gap-3 w-24 shrink-0">{thumbnails}</div>
        ) : null}
        <button
          type="button"
          className="relative aspect-square flex-1 overflow-hidden rounded-2xl border border-black/15"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={images[activeIndex].src}
            alt={title}
            fill
            priority
            className="object-contain"
          />
          {discount && discount > 0 ? (
            <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1.5 text-sm font-bold leading-none text-white">
              -{discount}%
            </span>
          ) : null}
        </button>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-200 flex flex-col bg-black/85 p-4">
          <button
            type="button"
            aria-label="Zatvori prikaz slike"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setIsLightboxOpen(false)}
          >
            <Cross2Icon className="h-5 w-5" />
          </button>

          {/* Main lightbox image */}
          <div className="flex flex-1 items-center justify-center gap-3 min-h-0">
            {images.length > 1 ? (
              <button
                type="button"
                aria-label="Prethodna slika"
                className="shrink-0 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
                onClick={prev}
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
            ) : null}

            <div className="relative h-full w-full max-w-3xl overflow-hidden rounded-2xl">
              <Image
                src={images[activeIndex].src}
                alt={`${title} - uvećani prikaz`}
                fill
                className="object-contain p-6"
              />
            </div>

            {images.length > 1 ? (
              <button
                type="button"
                aria-label="Sledeća slika"
                className="shrink-0 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
                onClick={next}
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            ) : null}
          </div>

          {/* Thumbnail strip at the bottom */}
          {images.length > 1 ? (
            <div className="flex shrink-0 items-center justify-center gap-3 pt-4 pb-2">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  aria-label={`Slika ${index + 1}`}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white/10",
                    activeIndex === index
                      ? "border-white"
                      : "border-transparent opacity-60 hover:opacity-90",
                  )}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    src={img.src}
                    alt={`${title} - thumbnail ${index + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};

export default ProductGallery;
