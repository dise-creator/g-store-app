import { create } from 'zustand';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity?: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  searchQuery: string;
  toggleCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void; // Добавляем этот метод в интерфейс
  setSearchQuery: (query: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  searchQuery: '',
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  addItem: (item) => set((state) => {
    const existing = state.items.find((i) => i.id === item.id);
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        ),
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));