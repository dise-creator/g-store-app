import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Game } from "./games";

interface WishlistState {
  items: Game[];
  toggleItem: (game: Game) => void;
  isInWishlist: (id: string | number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: async (game) => {
        const currentItems = get().items;
        
        // Надежное сравнение через приведение к строке
        const isFavorite = currentItems.some((i) => String(i.id) === String(game.id));
        
        let newItems;
        if (isFavorite) {
          newItems = currentItems.filter((i) => String(i.id) !== String(game.id));
        } else {
          newItems = [...currentItems, game];
        }

        // Обновляем локально мгновенно
        set({ items: newItems });

        // Отправка на бэкенд
        try {
          fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameIds: newItems.map(i => String(i.id)) }),
          });
        } catch (e) {
          console.error("Sync error:", e);
        }
      },
      isInWishlist: (id) => {
        const items = get().items || [];
        return items.some((item) => String(item.id) === String(id));
      },
    }),
    { 
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);