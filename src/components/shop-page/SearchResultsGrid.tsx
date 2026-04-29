"use client";

import { useState, useCallback } from "react";
import ProductCard from "@/components/common/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Product } from "@/types/product.types";

const PRODUCTS_PER_PAGE = 24;

function buildPaginationTokens(currentPage: number, totalPages: number) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, "ellipsis-right", totalPages - 1, totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, "ellipsis-left", totalPages - 1, totalPages] as const;
  }

  return [
    1,
    2,
    "ellipsis-left",
    currentPage,
    "ellipsis-right",
    totalPages - 1,
    totalPages,
  ] as const;
}

export default function SearchResultsGrid({
  products,
  query,
}: Readonly<{
  products: Product[];
  query: string;
}>) {
  const [currentPage, setCurrentPage] = useState(1);

  const hasProducts = products.length > 0;
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginationTokens = buildPaginationTokens(currentPage, totalPages);
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const pageProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

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
          <h1 className="font-bold text-2xl md:text-4xl text-brand">
            Rezultati pretrage
          </h1>
          {hasProducts && (
            <span className="text-xs md:text-sm text-black/60">
              Prikazano {start + 1}–
              {Math.min(start + PRODUCTS_PER_PAGE, products.length)} od{" "}
              {products.length} proizvoda za &quot;{query}&quot;
            </span>
          )}
        </div>
      </div>
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
            Nema rezultata pretrage za &quot;{query}&quot;.
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
  return (
    <PaginationItem>
      <PaginationLink
        href="#"
        isActive={isActive}
        onClick={(e) => {
          e.preventDefault();
          goTo(page);
        }}
        className={
          isActive
            ? "bg-brand text-white border-brand"
            : "border border-black/10 rounded-lg hover:bg-black/3"
        }
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  );
}
