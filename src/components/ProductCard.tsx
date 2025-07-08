'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import type { Product } from '../lib/productService';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="group relative block overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md"
      aria-label={`View ${product.title}`}
    >
      <div className="relative aspect-square w-full">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-opacity group-hover:opacity-90"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-1">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
            {product.stock > 0 && (
              <p className="text-xs text-gray-500">
                {product.stock} in stock
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;