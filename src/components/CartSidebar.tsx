"use client";

import { useCartStore } from "../stores/cartStore";
import type { CartItem } from "../stores/cartStore";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

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

  // Close when clicking outside
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

  const handleCheckout = () => {
    closeCart();
    // Replace with actual checkout navigation
    console.log("Proceeding to checkout with", items.length, "items");
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } z-50`}
      aria-hidden={!isOpen}
    >
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out h-full flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 id="cart-heading" className="text-lg font-bold flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Your Cart ({totalItems})
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700 p-1 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item: CartItem) => (
                <li key={item.product._id} className="py-4">
                  <div className="flex justify-between gap-4">
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          fill
                          className="object-cover rounded"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.product.title}
                        </h3>
                        <p className="text-gray-600">
                          ${item.product.price.toFixed(2)}
                        </p>
                        {typeof item.product.stock === "number" &&
                          item.quantity > item.product.stock && (
                            <p className="text-xs text-red-500 mt-1">
                              Only {item.product.stock} available
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        aria-label={`Remove ${item.product.title} from cart`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="flex items-center mt-2 border border-gray-200 rounded">
                        <button
                          onClick={() => decreaseQuantity(item.product._id)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-center min-w-[24px]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.product._id)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                          disabled={
                            typeof item.product.stock === "number"
                              ? item.quantity >= item.product.stock
                              : false
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-medium mt-2">
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
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition-colors font-medium"
              onClick={handleCheckout}
              aria-label="Proceed to checkout"
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
