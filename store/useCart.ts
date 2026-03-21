import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Добавляем мидлвар для сохранения данных

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  totalPrice: number;
  isSearchOpen: boolean;
  searchQuery: string;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void; // Новое: изменение кол-ва (+/-)
  clearCart: () => void;
  toggleCart: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      totalPrice: 0,
      isSearchOpen: false,
      searchQuery: '',

      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        const newItems = existingItem
          ? state.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
          : [...state.items, { ...item, quantity: 1 }];
        
        return {
          items: newItems,
          totalPrice: newItems.reduce((total, i) => total + i.price * i.quantity, 0),
          isOpen: true // Автоматически открываем корзину при добавлении
        };
      }),

      removeItem: (id) => set((state) => {
        const newItems = state.items.filter((i) => i.id !== id);
        return {
          items: newItems,
          totalPrice: newItems.reduce((total, i) => total + i.price * i.quantity, 0)
        };
      }),

      // Позволит кнопкам "+" и "-" в CartDrawer менять количество
      updateQuantity: (id, delta) => set((state) => {
        const newItems = state.items.map((i) => 
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        );
        return {
          items: newItems,
          totalPrice: newItems.reduce((total, i) => total + i.price * i.quantity, 0)
        };
      }),

      clearCart: () => set({ items: [], totalPrice: 0 }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      closeSearch: () => set({ isSearchOpen: false }),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'g-store-cart', // Ключ в localStorage
    }
  )
);