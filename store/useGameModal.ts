import { create } from "zustand";
import { Game } from "./games";

interface GameModalStore {
  isOpen: boolean;
  selectedGame: Game | null;
  openModal: (game: Game) => void;
  closeModal: () => void;
}

export const useGameModal = create<GameModalStore>((set) => ({
  isOpen: false,
  selectedGame: null,
  openModal: (game) => set({ isOpen: true, selectedGame: game }),
  closeModal: () => set({ isOpen: false, selectedGame: null }),
}));