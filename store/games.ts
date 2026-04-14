import { create } from 'zustand';

export interface GameEdition {
  name: string;
  price: number;
  features: string[];
  platform?: string;  // "PlayStation" | "Steam" | "Xbox"
  cards?: { value: number; quantity: number }[]; // карты пополнения
}

export interface Game {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  screenshots: string[];
  editions: GameEdition[];
  videoUrl?: string;
}

export const ALL_GAMES: Game[] = [
  { 
    id: "gow-1", 
    title: "GOD OF WAR", 
    price: 3500, 
    category: "Action",
    image: "/hero/1.jpg",
    shortDescription: "Продолжение легендарной саги.",
    fullDescription: "Отправьтесь в эпическое путешествие вместе с Кратосом и Атреем.",
    screenshots: ["/hero/1.jpg"],
    editions: [
      { 
        name: "Standard", 
        price: 3500, 
        platform: "PlayStation",
        features: ["Базовая игра"],
        cards: [{ value: 2000, quantity: 1 }, { value: 1500, quantity: 1 }]
      }
    ]
  },
  { 
    id: "spidey-1", 
    title: "SPIDER-MAN", 
    price: 2900, 
    category: "Action",
    image: "/hero/2.jpg", 
    shortDescription: "Станьте защитником Нью-Йорка.",
    fullDescription: "Невероятные полеты на паутине и динамичные сражения.",
    screenshots: ["/hero/2.jpg"],
    editions: [
      { 
        name: "Standard", 
        price: 2900, 
        platform: "PlayStation",
        features: ["Базовая игра"],
        cards: [{ value: 1500, quantity: 1 }, { value: 1500, quantity: 1 }]
      }
    ]
  },
  { 
    id: "tlou-1", 
    title: "LAST OF US II", 
    price: 2500, 
    category: "Action",
    image: "/hero/3.jpg",
    shortDescription: "Эмоциональная история Элли.",
    fullDescription: "Мир, где грани между добром и злом стерты.",
    screenshots: ["/hero/3.jpg"],
    editions: [
      { 
        name: "Standard", 
        price: 2500, 
        platform: "PlayStation",
        features: ["Базовая игра"],
        cards: [{ value: 2500, quantity: 1 }]
      }
    ]
  }
];

interface GamesStore {
  allGames: Game[];
  selectedGame: Game | null; 
  setAllGames: (games: Game[]) => void;
  setSelectedGame: (game: Game | null) => void; 
}

export const useGamesStore = create<GamesStore>((set) => ({
  allGames: ALL_GAMES,
  selectedGame: null, 
  setAllGames: (games) => set({ allGames: games }),
  setSelectedGame: (game) => set({ selectedGame: game }), 
}));