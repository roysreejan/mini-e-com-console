"use client";

import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/productService";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({
  product,
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    addItem(product);

    setTimeout(() => setIsAdding(false), 500);
  };

  const isOutOfStock = product.stock <= 0;

  // Button base classes
  const baseClasses = `flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`;

  // Dynamic classes based on state
  const variantClasses = isOutOfStock
    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
    : isAdding
    ? "bg-green-500 text-white"
    : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock || isAdding}
      className={`${baseClasses} ${variantClasses}`}
      aria-label={`Add ${product.title} to cart`}
      aria-disabled={isOutOfStock}
    >
      {isAdding ? (
        <>
          <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-green-400 opacity-75"></span>
          <span className="relative">✓</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
        </>
      )}
    </button>
  );
}
