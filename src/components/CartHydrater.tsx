"use client";
import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";

export default function CartHydrater() {
  const hydrateProducts = useCartStore(state => state.hydrateProducts);

  useEffect(() => {
    const timer = setTimeout(() => {
      hydrateProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [hydrateProducts]);

  return null;
}