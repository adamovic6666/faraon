"use client";

import { useCallback, useState } from "react";
import ProductCard from "@/components/common/ProductCard";
import SortSelect from "@/components/shop-page/SortSelect";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Product } from "@/types/product.types";

const PRODUCTS_PER_PAGE = 24;

function sortProducts(products: Product[], sort: string): Product[] {
  const list = [...products];
  if (sort === "niza-cena") return list.sort((a, b) => a.price - b.price);
  if (sort === "visa-cena") return list.sort((a, b) => b.price - a.price);
  return list;
}

export default function CategoryProductGrid({
  products,
  title,
}: Readonly<{
  products: Product[];
  title: string;
}>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const availableTags = Array.from(
    new Set(
      products
        .map((product) => product.tag?.trim())
        .filter((tag): tag is string => Boolean(tag)),
    ),
  ).sort((a, b) => a.localeCompare(b, "sr", { sensitivity: "base" }));

  const filteredProducts = selectedTag
    ? products.filter((product) => product.tag?.trim() === selectedTag)
    : products;

  const sorted = sortProducts(filteredProducts, sort);
  const hasProducts = sorted.length > 0;
  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE);
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
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleTagChange("")}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] transition-colors ${selectedTag === "" ? "border-brand bg-brand text-white" : "border-black/20 bg-white text-black/70 hover:bg-black/3"}`}
          >
            Svi tagovi
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagChange(tag)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] transition-colors ${selectedTag === tag ? "border-brand bg-brand text-white" : "border-black/20 bg-white text-black/70 hover:bg-black/3"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}
      {hasProducts ? (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {pageProducts.map((product, index) => (
            <ProductCard
              key={product.slug ?? `${product.title}-${start + index}`}
              data={product}
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
          <Pagination className="justify-between">
            <PaginationPrevious
              href="#"
              onClick={handlePrev}
              className={`border rounded-2xl border-black/10 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
            />
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PageButton
                    key={page}
                    page={page}
                    isActive={page === currentPage}
                    goTo={goTo}
                  />
                ),
              )}
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
