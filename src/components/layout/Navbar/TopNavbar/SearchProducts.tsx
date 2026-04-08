"use client";

import InputGroup from "@/components/ui/input-group";
import { searchProducts } from "@/lib/features/products/search";
import { SearchProduct } from "@/data/search-products";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const MIN_QUERY_LENGTH = 2;
const DROPDOWN_LIMIT = 5;
const DEBOUNCE_MS = 300;

type SearchProductsProps = {
  className?: string;
  variant?: "desktop" | "mobile-overlay";
};

const SearchProducts = ({
  className,
  variant = "desktop",
}: SearchProductsProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isMobileVariant = variant === "mobile-overlay";

  useEffect(() => {
    if (isMobileVariant) {
      return;
    }

    const onDocumentClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);

    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, [isMobileVariant]);

  useEffect(() => {
    if (!isMobileVariant) {
      return;
    }

    document.body.style.overflow = isMobileOverlayOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileVariant, isMobileOverlayOpen]);

  useEffect(() => {
    if (isMobileVariant && isMobileOverlayOpen) {
      inputRef.current?.focus();
    }
  }, [isMobileVariant, isMobileOverlayOpen]);

  useEffect(() => {
    if (!isMobileVariant || !isMobileOverlayOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileOverlay();
      }
    };

    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  }, [isMobileVariant, isMobileOverlayOpen]);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setIsLoading(false);
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    const timer = setTimeout(async () => {
      const data = await searchProducts(trimmed);
      setResults(data);
      setHasSearched(true);
      setIsLoading(false);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const dropdownResults = useMemo(
    () => results.slice(0, DROPDOWN_LIMIT),
    [results],
  );

  const onClear = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setIsLoading(false);
    setIsOpen(false);
  };

  const closeMobileOverlay = () => {
    setIsMobileOverlayOpen(false);
    onClear();
  };

  const resultsLink = `/webshop?search=${encodeURIComponent(query.trim())}`;
  const shouldShowDropdown = isOpen && query.trim().length >= MIN_QUERY_LENGTH;

  const renderSearchInput = (inputClassName: string) => (
    <InputGroup className={inputClassName}>
      <InputGroup.Text>
        <Image
          priority
          src="/icons/search.svg"
          height={20}
          width={20}
          alt="search"
          className="min-h-5 min-w-5"
        />
      </InputGroup.Text>

      <InputGroup.Input
        ref={inputRef}
        type="search"
        name="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => {
          if (query.trim().length >= MIN_QUERY_LENGTH) {
            setIsOpen(true);
          }
        }}
        placeholder="Pretraži proizvode po nazivu..."
        className={
          isMobileVariant
            ? "bg-transparent text-black/80 placeholder:text-black/45 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
            : "bg-transparent text-black/80 placeholder:text-black/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
        }
      />

      {query.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Obriši pretragu"
          className="mr-3 shrink-0 text-3xl leading-none text-black/70"
        >
          ×
        </button>
      )}
    </InputGroup>
  );

  const renderDropdown = () => {
    if (!shouldShowDropdown) {
      return null;
    }

    return (
      <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
        {isLoading && (
          <div className="px-4 py-5 text-center text-base font-light text-black/45">
            Učitavanje...
          </div>
        )}

        {!isLoading && dropdownResults.length > 0 && (
          <>
            <ul>
              {dropdownResults.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/webshop/${product.category}/${product.slug}`}
                    className="block border-b border-black/10 px-3 py-2 text-base leading-6 text-black/75 transition-colors hover:bg-black/3"
                    onClick={() => {
                      setIsOpen(false);
                      if (isMobileVariant) {
                        setIsMobileOverlayOpen(false);
                      }
                    }}
                  >
                    {product.title}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={resultsLink}
              className="block px-3 py-3 text-center text-base font-semibold text-brand"
              onClick={() => {
                setIsOpen(false);
                if (isMobileVariant) {
                  setIsMobileOverlayOpen(false);
                }
              }}
            >
              Prikaži sve rezultate
            </Link>
          </>
        )}

        {!isLoading && hasSearched && dropdownResults.length === 0 && (
          <div className="px-4 py-5 text-center text-base font-light leading-6 text-black/45">
            Nema rezultata pretrage za{" "}
            <b className="font-semibold text-black/55">
              &quot;{query.trim()}&quot;
            </b>
          </div>
        )}
      </div>
    );
  };

  if (isMobileVariant) {
    return (
      <>
        <button
          type="button"
          className="mr-1 block p-1 md:hidden"
          aria-label="Otvori pretragu"
          onClick={() => {
            setIsMobileOverlayOpen(true);
            setIsOpen(true);
          }}
        >
          <Image
            priority
            src="/icons/search-black.svg"
            height={100}
            width={100}
            alt="search"
            className="max-h-5.5 max-w-5.5"
          />
        </button>

        {isMobileOverlayOpen && (
          <div className="fixed inset-0 z-200 p-3">
            <button
              type="button"
              aria-label="Zatvori pretragu"
              onClick={closeMobileOverlay}
              className="absolute inset-0 bg-black/80"
            />

            <div className="relative z-10">
              <button
                type="button"
                onClick={closeMobileOverlay}
                aria-label="Zatvori pretragu"
                className="absolute right-1 -top-11 text-3xl leading-none text-white"
              >
                ×
              </button>
              {renderSearchInput("w-full bg-white")}
              {renderDropdown()}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      {renderSearchInput(className ?? "")}
      {renderDropdown()}
    </div>
  );
};

export default SearchProducts;
