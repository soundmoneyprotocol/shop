import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number; // in cents
  image: string;
  creatorName: string;
  quantity: number;
  maxStock: number;
}

interface CartStore {
  // State
  items: CartItem[];
  totalItems: number;
  totalPrice: number; // in cents

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Helpers
  getItem: (id: string) => CartItem | undefined;
  calculateTotals: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id);

          if (existingItem) {
            // Update quantity if already in cart
            const updated = state.items.map((item) =>
              item.id === newItem.id
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + 1, item.maxStock),
                  }
                : item
            );
            return { items: updated };
          } else {
            // Add new item
            return {
              items: [...state.items, { ...newItem, quantity: 1 }],
            };
          }
        });

        get().calculateTotals();
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        get().calculateTotals();
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(quantity, item.maxStock) }
              : item
          ),
        }));
        get().calculateTotals();
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },

      getItem: (id: string) => {
        return get().items.find((item) => item.id === id);
      },

      calculateTotals: () => {
        const state = get();
        const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        set({ totalItems, totalPrice });
      },
    }),
    {
      name: 'shopping-cart',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
    }
  )
);
