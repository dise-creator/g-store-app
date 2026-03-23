import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  toggleCart: () => void;
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void; // Добавим полезный метод очистки
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addItem: (product) => set((state) => {
        const existingItem = state.items.find((item) => item.id === product.id);
        
        if (existingItem) {
          return {
            items: state.items.map((item) =>
              item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ),
          };
        }
        
        return { 
          items: [...state.items, { ...product, quantity: 1 }] 
        };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
      })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);