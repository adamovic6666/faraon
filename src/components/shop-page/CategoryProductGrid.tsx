"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/common/ProductCard";
import SortSelect from "@/components/shop-page/SortSelect";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product.types";

const PRODUCTS_PER_PAGE = 24;

const tagButtonClass = (isSelected: boolean) =>
  cn(
    "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] transition-colors",
    isSelected
      ? "border-brand bg-brand text-white"
      : "border-black/20 bg-white text-black/70 hover:bg-black/3",
  );

function buildPaginationTokens(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1) as (
      | number
      | string
    )[];
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let p = currentPage - 1; p <= currentPage + 1; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | string)[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(sorted[i]);
  }
  return result;
}

function sortProducts(products: Product[], sort: string): Product[] {
  const list = [...products];
  if (sort === "niza-cena") return list.sort((a, b) => a.price - b.price);
  if (sort === "visa-cena") return list.sort((a, b) => b.price - a.price);
  return list;
}

function TagFilterBar({
  tags,
  selectedTag,
  onTagChange,
}: Readonly<{
  tags: string[];
  selectedTag: string;
  onTagChange: (value: string) => void;
}>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHintLeft, setShowScrollHintLeft] = useState(false);
  const [showScrollHintRight, setShowScrollHintRight] = useState(false);

  const updateScrollHintRight = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const hasOverflow = el.scrollWidth > el.clientWidth + 1;
    const scrollLeft = Math.round(el.scrollLeft);
    const atEnd =
      Math.ceil(scrollLeft + el.clientWidth) >= el.scrollWidth - 1;

    setShowScrollHintRight(hasOverflow && !atEnd);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const hasOverflow = el.scrollWidth > el.clientWidth + 1;
    const scrollLeft = Math.round(el.scrollLeft);

    setShowScrollHintLeft(hasOverflow && scrollLeft > 4);
    updateScrollHintRight();
  }, [updateScrollHintRight]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollLeft = 0;
    setShowScrollHintLeft(false);

    const measureRight = () => {
      setShowScrollHintLeft(false);
      updateScrollHintRight();
    };

    const observer = new ResizeObserver(measureRight);
    observer.observe(el);

    const rafId = requestAnimationFrame(measureRight);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [tags, updateScrollHintRight]);

  return (
    <div className="relative mb-6">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-x-auto w-full scrollbar-none scroll-smooth md:overflow-visible"
        role="group"
        aria-label="Filter po oznakama"
      >
        <div className="flex w-max flex-nowrap items-center gap-2 pr-10 md:w-full md:flex-wrap md:pr-0">
          <button
            type="button"
            onClick={() => onTagChange("")}
            className={tagButtonClass(selectedTag === "")}
          >
            Sve
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagChange(tag)}
              className={tagButtonClass(selectedTag === tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {showScrollHintLeft ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-start md:hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-transparent" />
          <ChevronLeft className="relative ml-0.5 size-4 shrink-0 text-black/40" />
        </div>
      ) : null}

      {showScrollHintRight ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end md:hidden"
        >
          <div className="absolute inset-0 bg-linear-to-l from-background via-background/90 to-transparent" />
          <ChevronRight className="relative mr-0.5 size-4 shrink-0 text-black/40" />
        </div>
      ) : null}
    </div>
  );
}

export default function CategoryProductGrid({
  products,
  title,
  category,
}: Readonly<{
  products: Product[];
  title: string;
  category?: string;
}>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const availableTags = Array.from(
    new Set(
      products
        .flatMap((product) => product.tags?.map((t) => t.trim()) ?? [])
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "sr", { sensitivity: "base" }));

  const filteredProducts = selectedTag
    ? products.filter((product) =>
        product.tags?.some((t) => t.trim() === selectedTag),
      )
    : products;

  const sorted = sortProducts(filteredProducts, sort);
  const hasProducts = sorted.length > 0;
  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE);
  const paginationTokens = buildPaginationTokens(currentPage, totalPages);
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const pageProducts = sorted.slice(start, start + PRODUCTS_PER_PAGE);

  const handleSort = useCallback((value: string) => {
    setSort(value);
    setCurrentPage(1);
  }, []);

  const handleTagChange = useCallback((value: string) => {
    setSelectedTag(value);
    setCurrentPage(1);
  }, []);

  const goTo = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (currentPage > 1) goTo(currentPage - 1);
    },
    [currentPage, goTo],
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (currentPage < totalPages) goTo(currentPage + 1);
    },
    [currentPage, totalPages, goTo],
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="font-bold text-2xl md:text-4xl text-brand">{title}</h1>
          {hasProducts && (
            <span className="text-xs md:text-sm text-black/60">
              Prikazano {start + 1}–
              {Math.min(start + PRODUCTS_PER_PAGE, sorted.length)} od{" "}
              {sorted.length} proizvoda
            </span>
          )}
        </div>
        {hasProducts && (
          <SortSelect currentSort={sort} onSortChange={handleSort} />
        )}
      </div>
      {availableTags.length > 0 ? (
        <TagFilterBar
          tags={availableTags}
          selectedTag={selectedTag}
          onTagChange={handleTagChange}
        />
      ) : null}
      {hasProducts ? (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {pageProducts.map((product, index) => (
            <ProductCard
              key={product.slug ?? `${product.title}-${start + index}`}
              data={product}
              category={category}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-section p-8 md:p-10 text-center">
          <p className="text-base md:text-lg text-black/75">
            Trenutno nema proizvoda u ovoj kategoriji.
          </p>
        </div>
      )}
      {hasProducts && totalPages > 1 && (
        <div className="mt-10 md:mt-12 flex justify-center">
          <Pagination className="w-auto max-w-full items-center gap-2">
            <PaginationPrevious
              href="#"
              onClick={handlePrev}
              className={`border rounded-2xl border-black/10 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
            />
            <PaginationContent className="gap-0.5 sm:gap-1">
              {paginationTokens.map((token, index) => {
                if (typeof token !== "number") {
                  return (
                    <PaginationItem key={`${token}-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PageButton
                    key={token}
                    page={token}
                    isActive={token === currentPage}
                    goTo={goTo}
                  />
                );
              })}
            </PaginationContent>
            <PaginationNext
              href="#"
              onClick={handleNext}
              className={`border rounded-2xl border-black/10 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
            />
          </Pagination>
        </div>
      )}
    </>
  );
}

function PageButton({
  page,
  isActive,
  goTo,
}: Readonly<{
  page: number;
  isActive: boolean;
  goTo: (page: number) => void;
}>) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      goTo(page);
    },
    [page, goTo],
  );

  return (
    <PaginationItem>
      <PaginationLink
        href="#"
        onClick={handleClick}
        isActive={isActive}
        className="text-black/50 font-medium text-sm"
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  );
}
