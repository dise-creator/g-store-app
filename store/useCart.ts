import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Game } from './games';
import type { Region } from './useRegion';

interface CartItem extends Game {
  quantity: number;
  cartItemId: string;
  region: Region; // ← добавили регион
}

interface CartStore {
  items: CartItem[];
  addItem: (game: Game & { selectedEdition?: string; region?: Region }) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (game) => set((state) => {
        const editionName = (game as any).selectedEdition || "Standard";
        const cartItemId = `${game.id}-${editionName}`;
        const existingItem = state.items.find(item => item.cartItemId === cartItemId);

        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        }

        return {
          items: [
            ...state.items,
            {
              ...game,
              cartItemId,
              quantity: 1,
              price: Number(game.price) || 0,
              region: game.region || "TR", // ← сохраняем регион
            }
          ]
        };
      }),

      removeItem: (cartItemId) => set((state) => ({
        items: state.items.filter((item) => item.cartItemId !== cartItemId)
      })),

      updateQuantity: (cartItemId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter(item => item.quantity > 0)
      })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'clic-cart-storage',
    }
  )
);

export const getTotalPrice = (items: CartItem[]) => {
  return items.reduce((total, item) => {
    return total + (Number(item.price) * item.quantity);
  }, 0);
};