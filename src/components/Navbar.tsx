"use client";

import { useCartStore } from "../stores/cartStore";
import { ShoppingCart, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { toggleCart, totalItems } = useCartStore();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white/95 shadow-sm py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Left Section - Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center text-gray-900 hover:text-gray-600 cursor-pointer transition-colors"
            aria-label="Home"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push("/");
            }}
          >
            <Home className="h-5 w-5 mr-2" />
            <span className="font-semibold text-lg hidden sm:inline">
              Mini E-Commerce
            </span>
            <span className="font-semibold text-lg sm:hidden">ME</span>
          </div>

          {/* Right Section - Cart */}
          <div className="flex items-center justify-end flex-1">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce"
                  aria-live="polite"
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
