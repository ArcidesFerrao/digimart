"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProductWithSeller } from "@/types";

interface ProductCardProps {
  product: ProductWithSeller;
}

const categoryLabels: Record<string, string> = {
  EBOOK: "eBook",
  TEMPLATE: "Template",
  COURSE: "Curso",
  OTHER: "Outro",
};

const categoryVariants: Record<string, "teal" | "warn" | "green" | "default"> = {
  EBOOK: "teal",
  TEMPLATE: "warn",
  COURSE: "green",
  OTHER: "default",
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-teal/50 hover:shadow-lg hover:shadow-teal/5">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-border">
          <Image
            src={product.coverImage}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <Badge variant={categoryVariants[product.category] || "default"}>
              {categoryLabels[product.category] || product.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2 group-hover:text-teal transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-teal font-bold text-lg">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted">
              por {product.seller.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
