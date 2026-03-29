"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "akcija", label: "Akcija" },
  { value: "niza-cena", label: "Niža cena" },
  { value: "visa-cena", label: "Viša cena" },
];

function getSortLabel(currentSort: string) {
  return SORT_OPTIONS.find((option) => option.value === currentSort)?.label;
}

export default function SortSelect({
  currentSort,
  onSortChange,
}: Readonly<{
  currentSort: string;
  onSortChange: (value: string) => void;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const currentLabel = getSortLabel(currentSort);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    globalThis.addEventListener("pointerdown", onPointerDown);
    globalThis.addEventListener("keydown", onEscape);
    return () => {
      globalThis.removeEventListener("pointerdown", onPointerDown);
      globalThis.removeEventListener("keydown", onEscape);
    };
  }, []);

  const handleSelect = (value: string) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={
          currentLabel ? `Sortiranje: ${currentLabel}` : "Sortiraj proizvode"
        }
        className="group flex justify-center items-center h-9 w-auto cursor-pointer rounded-full border border-black/10 bg-white px-3.5 text-sm font-medium text-black shadow-none transition-colors hover:bg-black/3"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="flex">Sortiraj</span>
        <ChevronDownIcon
          className={cn(
            "relative top-px ml-1 h-3 w-3 text-black/70 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
        <span className="sr-only">
          {currentLabel ? `Sortiranje: ${currentLabel}` : "Sortiraj proizvode"}
        </span>
      </button>

      {isOpen && (
        <ul
          aria-label="Sortiraj proizvode"
          className="absolute right-0 top-full z-20 mt-2 min-w-40 overflow-hidden rounded-xl border border-black/10 bg-white p-1 shadow-md"
        >
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-black/5",
                  currentSort === opt.value && "bg-black/5 font-medium",
                )}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
