"use client";

import React, { useState } from "react";
import { useCartStore } from "@/stores/cartStore";

export default function CheckoutModal() {
  const isCheckoutOpen = useCartStore((state) => state.isCheckoutOpen);
  const closeCheckout = useCartStore((state) => state.closeCheckout);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();

      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: "", email: "", address: "" });
        closeCheckout();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-white/80 backdrop-blur-md">
      <div
        className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        role="dialog"
        aria-modal="true"
      >
        {isSuccess ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Order Placed Successfully!
            </h3>
            <p className="text-gray-600">Thank you for your purchase.</p>
          </div>
        ) : (
          <>
            <button
              onClick={closeCheckout}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
              aria-label="Close modal"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
