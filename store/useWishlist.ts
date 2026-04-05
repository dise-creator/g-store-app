import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Game } from './games';

interface WishlistState {
  items: Game[];
  toggleItem: (game: Game) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (game) => {
        const isExist = get().items.some((item) => item.id === game.id);
        if (isExist) {
          set({ items: get().items.filter((item) => item.id !== game.id) });
        } else {
          set({ items: [...get().items, game] });
        }
      },
      isInWishlist: (id) => get().items.some((item) => item.id === id),
    }),
    { name: 'wishlist-storage' }
  )
);