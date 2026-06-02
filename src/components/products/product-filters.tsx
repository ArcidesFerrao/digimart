"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
  search: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function ProductFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <Input
          placeholder="Pesquisar produtos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted" />
        <Select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-40"
        >
          <option value="ALL">Todas categorias</option>
          <option value="EBOOK">eBooks</option>
          <option value="TEMPLATE">Templates</option>
          <option value="COURSE">Cursos</option>
          <option value="OTHER">Outros</option>
        </Select>
      </div>
    </div>
  );
}
