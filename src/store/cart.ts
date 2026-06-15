import { create } from "zustand";

export type CartEntry = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
};

type CartState = {
  items: CartEntry[];
  add: (entry: Omit<CartEntry, "quantity">) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()((set) => ({
  items: [],

  add: (incoming) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === incoming.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === incoming.productId
              ? { ...i, quantity: Math.min(99, i.quantity + 1) }
              : i,
          ),
        };
      }
      return { items: [...state.items, { ...incoming, quantity: 1 }] };
    }),

  remove: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),

  setQuantity: (productId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.productId !== productId)
          : state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i,
            ),
    })),

  clear: () => set({ items: [] }),
}));

export const selectCartTotal = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
