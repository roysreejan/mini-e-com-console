import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "../lib/productService";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,

      addItem: (product) => {
        if (product.stock <= 0) return;

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product._id === product._id
          );
          let newItems;

          if (existingItemIndex >= 0) {
            newItems = state.items.map((item, index) =>
              index === existingItemIndex && item.quantity < product.stock
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            newItems = [...state.items, { product, quantity: 1 }];
          }

          return {
            items: newItems,
            ...calculateTotals(newItems),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.product._id !== productId
          );
          return {
            items: newItems,
            ...calculateTotals(newItems),
          };
        });
      },

      increaseQuantity: (productId) => {
        set((state) => {
          const item = state.items.find(
            (item) => item.product._id === productId
          );
          if (!item || item.quantity >= item.product.stock) return state;

          const newItems = state.items.map((item) =>
            item.product._id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          return {
            items: newItems,
            ...calculateTotals(newItems),
          };
        });
      },

      decreaseQuantity: (productId) => {
        set((state) => {
          const newItems = state.items
            .map((item) =>
              item.product._id === productId
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item
            )
            .filter((item) => item.quantity > 0);

          return {
            items: newItems,
            ...calculateTotals(newItems),
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const product = state.items.find(
            (item) => item.product._id === productId
          )?.product;
          const validQuantity = Math.min(
            Math.max(1, quantity),
            product?.stock || quantity
          );

          const newItems = state.items
            .map((item) =>
              item.product._id === productId
                ? { ...item, quantity: validQuantity }
                : item
            )
            .filter((item) => item.quantity > 0);

          return {
            items: newItems,
            ...calculateTotals(newItems),
          };
        });
      },

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "cart-storage-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
