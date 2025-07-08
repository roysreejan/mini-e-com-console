import { getProductById } from "@/lib/productService";
import { AddToCartButton } from "@/components/AddToCartButton";
import Image from "next/image";
import Link from "next/link";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Product Image */}
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-gradient-to-br from-white to-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              {product.title}
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <p className="text-3xl font-semibold text-blue-600">
                ${product.price.toFixed(2)}
              </p>
              {product.stock > 0 ? (
                <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full shadow-sm">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-sm font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full shadow-sm">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <AddToCartButton product={product} />

            {product.stock > 0 && (
              <Link
                href="/checkout"
                className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Proceed to Checkout
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
