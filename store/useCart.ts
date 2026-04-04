import { create } from 'zustand';
import type { Game } from './games';

interface CartItem extends Game {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (game: Game) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void; // Добавляем сюда
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (game) => set((state) => {
    const existingItem = state.items.find(item => item.id === game.id);
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { items: [...state.items, { ...game, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => String(item.id) !== String(id))
  })),
  // РЕАЛИЗАЦИЯ ФУНКЦИИ:
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
    ).filter(item => item.quantity > 0)
  })),
  clearCart: () => set({ items: [] }),
  totalPrice: () => {
    const items = get().items;
    return items.reduce((total, item) => {
      const price = Number(item.price) || 0;
      return total + (price * item.quantity);
    }, 0);
  },
}));