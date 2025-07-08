import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/productService";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="container mx-auto px-6 pt-4 py-12 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
        Our Products
      </h1>

      {products.length > 0 ? (
        <div className="flex justify-center">
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4 
              gap-8
              max-w-[1300px]
              w-full
            "
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-400 text-xl">No products available</p>
        </div>
      )}
    </main>
  );
}
