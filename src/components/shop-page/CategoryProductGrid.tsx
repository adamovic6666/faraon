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
  if (sort === "akcija")
    return list.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
  return list;
}

export default function CategoryProductGrid({
  products,
  categoryLabel,
}: Readonly<{
  products: Product[];
  categoryLabel: string;
}>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("");

  const sorted = sortProducts(products, sort);
  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE);
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const pageProducts = sorted.slice(start, start + PRODUCTS_PER_PAGE);

  const handleSort = useCallback((value: string) => {
    setSort(value);
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
      <div className="flex items-center justify-between mb-6">
        <SortSelect currentSort={sort} onSortChange={handleSort} />
        <div className="text-right">
          <h1 className="font-bold text-2xl md:text-4xl text-brand">
            {categoryLabel}
          </h1>
          <span className="text-sm text-black/60">
            Prikazano {start + 1}–
            {Math.min(start + PRODUCTS_PER_PAGE, sorted.length)} od{" "}
            {sorted.length} proizvoda
          </span>
        </div>
      </div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
        {pageProducts.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
      {totalPages > 1 && (
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
