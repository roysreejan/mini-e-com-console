"use client";

import { useCartStore } from "../stores/cartStore";
import type { CartItem } from "../stores/cartStore";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const CartSidebar = () => {
  const {
    isOpen,
    closeCart,
    items,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    totalPrice,
    totalItems,
  } = useCartStore();

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeCart();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeCart]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-heading"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h2
                id="cart-heading"
                className="text-lg font-bold flex items-center"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Your Cart ({totalItems})
              </h2>
              <button
                onClick={closeCart}
                className="text-gray-600 hover:text-gray-900 p-1 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-6 text-lg">
                    Your cart is empty
                  </p>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {items.map((item: CartItem) => (
                    <li key={item.product._id} className="py-5">
                      <div className="flex justify-between gap-4">
                        <div className="flex gap-4 flex-1 min-w-0">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src={item.product.image}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                              priority={false}
                            />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h3 className="font-medium text-gray-900 truncate text-base">
                              {item.product.title}
                            </h3>
                            <p className="text-gray-700 mt-1 font-semibold">
                              ${item.product.price.toFixed(2)}
                            </p>
                            {typeof item.product.stock === "number" &&
                              item.quantity > item.product.stock && (
                                <p className="text-xs text-red-600 mt-1 font-medium">
                                  Only {item.product.stock} available
                                </p>
                              )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeItem(item.product._id)}
                            className="text-red-600 hover:text-red-800 p-1 transition-colors"
                            aria-label={`Remove ${item.product.title}`}
                          >
                            <X className="h-5 w-5" />
                          </button>
                          <div className="flex items-center mt-2 border border-gray-300 rounded-md overflow-hidden">
                            <button
                              onClick={() => decreaseQuantity(item.product._id)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4 text-gray-800" />
                            </button>
                            <span className="px-4 text-black font-medium min-w-[28px] text-center select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.product._id)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                              disabled={
                                typeof item.product.stock === "number"
                                  ? item.quantity >= item.product.stock
                                  : false
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4 text-gray-800" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold mt-3 text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 bg-gray-50">
                <div className="flex justify-between font-bold text-lg mb-4 text-gray-900">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors font-semibold"
                  onClick={handleCheckout}
                  aria-label="Proceed to checkout"
                >
                  Proceed to Checkout
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
