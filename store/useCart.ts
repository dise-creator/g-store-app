import { create } from 'zustand';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
    // Можно автоматически открывать корзину при добавлении:
    // isOpen: true 
  })),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),

  toggleCart: () => set((state) => ({ 
    isOpen: !state.isOpen 
  })),

  clearCart: () => set({ items: [] }),
}));