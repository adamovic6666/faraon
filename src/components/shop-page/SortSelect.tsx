"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "akcija", label: "Akcija" },
  { value: "niza-cena", label: "Niža cena" },
  { value: "visa-cena", label: "Viša cena" },
];

export default function SortSelect({
  currentSort,
  onSortChange,
}: Readonly<{
  currentSort: string;
  onSortChange: (value: string) => void;
}>) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-black/60">Sortiraj:</span>
      <Select value={currentSort || undefined} onValueChange={onSortChange}>
        <SelectTrigger className="font-medium text-sm w-fit border border-black/10 shadow-none bg-transparent">
          <SelectValue placeholder="Odaberi" />
        </SelectTrigger>
        <SelectContent>
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
