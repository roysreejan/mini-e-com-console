import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, getProducts } from "../lib/productService";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  totalItems: number;
  totalPrice: number;
  isHydrating: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  hydrateProducts: () => Promise<void>;
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
    (set, get) => ({
      items: [],
      isOpen: false,
      isCheckoutOpen: false,
      totalItems: 0,
      totalPrice: 0,
      isHydrating: false,

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

      openCheckout: () => set({ isCheckoutOpen: true }),
      closeCheckout: () => set({ isCheckoutOpen: false }),

      hydrateProducts: async () => {
        const { items } = get();
        if (items.length === 0) return;

        try {
          set({ isHydrating: true });

          // Option 1: Fetch all products and match them (better for small product catalogs)
          const allProducts = await getProducts();

          set((state) => {
            const newItems = state.items
              .map((item) => {
                const updatedProduct = allProducts.find(
                  (p) => p._id === item.product._id
                );
                return updatedProduct
                  ? { ...item, product: updatedProduct }
                  : item;
              })
              .filter((item) => item.product); // Remove items with missing products

            return {
              items: newItems,
              ...calculateTotals(newItems),
            };
          });
        } catch (error) {
          console.error("Failed to hydrate cart products:", error);
        } finally {
          set({ isHydrating: false });
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { totalItems, totalPrice } = calculateTotals(state.items);
          state.totalItems = totalItems;
          state.totalPrice = totalPrice;
        }
      },
    }
  )
);
