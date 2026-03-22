import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Добавляем этот важный модуль

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
  addItem: (product: any) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addItem: (product) => set((state) => {
        // Проверяем, есть ли уже такой товар
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
        
        // Если товара нет, добавляем его с количеством 1
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
    }),
    {
      name: 'cart-storage', // Ключ, по которому корзина будет лежать в LocalStorage
    }
  )
);