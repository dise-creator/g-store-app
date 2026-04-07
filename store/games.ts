import { create } from 'zustand';

export interface GameEdition {
  name: string;
  price: number;
  features: string[];
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
    id: "2", 
    title: "КИБЕРПАНК 2077", 
    price: 2500, 
    category: "RPG",
    image: "/images/cyber.jpg",
    shortDescription: "Приключенческая ролевая игра в открытом мире Найт-Сити.",
    fullDescription: "Cyberpunk 2077 — это приключенческая ролевая игра, действие которой происходит в мегаполисе Найт-Сити, где власть, роскошь и модификации тела ценятся выше всего. Вы играете за V, наёмника в поисках уникального устройства, позволяющего обрести бессмертие.",
    screenshots: ["/images/cyber.jpg", "/images/cyber.jpg", "/images/cyber.jpg"],
    editions: [
      { name: "Standard", price: 2500, features: ["Базовая игра", "Цифровые бонусы"] },
      { name: "Deluxe", price: 3990, features: ["Базовая игра", "Дополнение Phantom Liberty", "Саундтрек"] }
    ]
  },
  { 
    id: "3", 
    title: "ELDEN RING", 
    price: 3990, 
    category: "RPG",
    image: "/images/elden_main.jpg", 
    shortDescription: "Восстань, Погасшая душа, и стань владыкой Элдена в Междуземье.",
    fullDescription: "Золотой Порядок разрушен. В Междуземье владычествует хаос, а осколки Кольца Элдена попали в руки безумных полубогов. Вам предстоит пройти через туманные земли, сразить легендарных врагов и решить судьбу этого мира.",
    screenshots: ["/images/elden.jpg", "/images/cyber.jpg", "/images/mc.jpg", "/images/gta.jpg"],
    editions: [
      { name: "Standard", price: 3990, features: ["Базовая игра"] },
      { name: "Shadow Edition", price: 5990, features: ["Базовая игра", "Дополнение Shadow of the Erdtree", "Цифровой артбук"] }
    ]
  },
  { 
    id: "5", 
    title: "MINECRAFT", 
    price: 1500, 
    category: "Sandbox",
    image: "/images/mc.jpg",
    shortDescription: "Строй, выживай и исследуй бесконечные миры из блоков.",
    fullDescription: "Minecraft — это игра о расстановке блоков и поиске приключений.",
    screenshots: ["/images/mc.jpg", "/images/starfield.jpg"],
    editions: [
      { name: "Java Edition", price: 1500, features: ["Классическая версия", "Поддержка модов"] },
      { name: "Deluxe Collection", price: 2800, features: ["Java & Bedrock", "1600 жетонов", "Набор скинов"] }
    ]
  },
  { 
    id: "4", 
    title: "GTA V", 
    price: 1990, 
    category: "Action",
    image: "/images/gta.jpg",
    shortDescription: "Криминальный триллер в открытом мире Лос-Сантоса.",
    fullDescription: "Чтобы провести серию дерзких ограблений и выжить в большом городе...",
    screenshots: ["/images/gta.jpg", "/images/cyber.jpg"],
    editions: [
      { name: "Premium Edition", price: 1990, features: ["Сюжетный режим", "GTA Online", "Набор 'Преступная организация'"] }
    ]
  },
  { 
    id: "6", 
    title: "STARFIELD", 
    price: 4500, 
    category: "Sci-Fi", 
    image: "/images/starfield.jpg",
    shortDescription: "Ролевая игра нового поколения в открытом космосе.",
    fullDescription: "В этой игре от Bethesda Game Studios вы сможете создать любого персонажа...",
    screenshots: ["/images/starfield.jpg", "/images/cyber.jpg"],
    editions: [
      { name: "Standard", price: 4500, features: ["Базовая игра"] },
      { name: "Constellation", price: 9900, features: ["Базовая игра", "Сюжетное дополнение", "Часы Chronomark"] }
    ]
  },
];

// --- ДОБАВЛЕНО: Глобальный стор для синхронизации игр ---
interface GamesStore {
  allGames: Game[];
  setAllGames: (games: Game[]) => void;
}

export const useGamesStore = create<GamesStore>((set) => ({
  allGames: ALL_GAMES, // Изначально используем статику из файла
  setAllGames: (games) => set({ allGames: games }), // Функция для обновления данных из БД
}));