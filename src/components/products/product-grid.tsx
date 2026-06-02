"use client";

import { ProductCard } from "./product-card";
import { ProductWithSeller } from "@/types";

interface ProductGridProps {
  products: ProductWithSeller[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted text-lg">Nenhum produto encontrado.</p>
        <p className="text-muted text-sm mt-2">Tente ajustar os filtros ou volte mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
