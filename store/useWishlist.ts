import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Game } from "./games";

interface WishlistState {
  items: Game[];
  toggleItem: (game: Game) => void;
  isInWishlist: (id: string | number) => boolean;
  clearAll: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: async (game) => {
        const currentItems = get().items;
        const isFavorite = currentItems.some((i) => String(i.id) === String(game.id));
        const newItems = isFavorite
          ? currentItems.filter((i) => String(i.id) !== String(game.id))
          : [...currentItems, game];

        set({ items: newItems });

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

      clearAll: () => {
        set({ items: [] });
        try {
          fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameIds: [] }),
          });
        } catch (e) {
          console.error("Sync error:", e);
        }
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);