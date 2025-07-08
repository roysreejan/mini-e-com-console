"use client";

import { useEffect } from "react";
import CheckoutModal from "@/components/CheckoutModal";
import { useCartStore } from "@/stores/cartStore";

export default function CheckoutPage() {
  const openCheckout = useCartStore((state) => state.openCheckout);

  useEffect(() => {
    openCheckout();
  }, [openCheckout]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout Page</h1>
      <CheckoutModal />
    </main>
  );
}
