import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Добавляем для сохранения данных
import type { Game } from './games';

interface CartItem extends Game {
  quantity: number;
  cartItemId: string; // Уникальный ID для позиции в корзине (id + edition)
}

interface CartStore {
  items: CartItem[];
  addItem: (game: Game & { selectedEdition?: string }) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

// Используем persist, чтобы корзина не слетала при обновлении страницы
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (game) => set((state) => {
        // Создаем уникальный ключ на основе ID игры и названия издания
        // Это позволит добавить одну и ту же игру разных версий как разные товары
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
              // Гарантируем числовой формат цены при добавлении
              price: Number(game.price) || 0 
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
      name: 'clic-cart-storage', // Ключ в localStorage
    }
  )
);

// Селектор для итоговой цены (лучше держать вне стора или как мемоизированный хук)
export const getTotalPrice = (items: CartItem[]) => {
  return items.reduce((total, item) => {
    return total + (Number(item.price) * item.quantity);
  }, 0);
};