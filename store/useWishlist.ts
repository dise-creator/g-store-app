import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Game } from "./games";

interface WishlistState {
  items: Game[];
  toggleItem: (game: Game) => void;
  isInWishlist: (id: string | number) => boolean;
  clearAll: () => void;
}

const syncWishlist = (gameIds: string[]) => {
  fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameIds }),
  }).catch(() => {});
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (game) => {
        const currentItems = get().items;
        const isFavorite = currentItems.some((i) => String(i.id) === String(game.id));
        const newItems = isFavorite
          ? currentItems.filter((i) => String(i.id) !== String(game.id))
          : [...currentItems, game];

        set({ items: newItems });
        syncWishlist(newItems.map(i => String(i.id)));
      },

      isInWishlist: (id) =>
        get().items.some((item) => String(item.id) === String(id)),

      clearAll: () => {
        set({ items: [] });
        syncWishlist([]);
      },
    }),
    { name: "wishlist-storage" }
  )
);