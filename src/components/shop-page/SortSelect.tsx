"use client";

import { FiSliders } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

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
  const currentLabel = getSortLabel(currentSort);

  return (
    <div className="flex items-center">
      <Select value={currentSort || undefined} onValueChange={onSortChange}>
        <SelectTrigger
          hideIcon
          aria-label={
            currentLabel ? `Sortiranje: ${currentLabel}` : "Sortiraj proizvode"
          }
          className="h-9 w-9 cursor-pointer rounded-full border-none bg-[#F0F0F0] p-0 text-black/60 shadow-none hover:bg-[#e7e7e7]"
        >
          <FiSliders className="mx-auto text-base" aria-hidden="true" />
          <span className="sr-only">
            {currentLabel
              ? `Sortiranje: ${currentLabel}`
              : "Sortiraj proizvode"}
          </span>
        </SelectTrigger>
        <SelectContent className="min-w-32" align="end">
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
