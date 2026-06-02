"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductWithSeller } from "@/types";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  async function fetchProducts() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "ALL") params.append("category", category);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <span className="font-mono text-xs uppercase tracking-wider text-teal mb-4 block">
          Marketplace
        </span>
        <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide mb-4">
          TODOS OS <span className="text-teal">PRODUTOS</span>
        </h1>
        <p className="text-muted max-w-xl">
          Descobre eBooks, templates, cursos e outros produtos digitais criados
          por talentos moçambicanos.
        </p>
      </div>

      {/* Filters */}
      <ProductFilters
        search={search}
        category={category}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 text-teal animate-spin" />
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
