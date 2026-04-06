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
  category: string; // Сделали обязательным для корректной фильтрации
  shortDescription: string; // Вместо старого description
  fullDescription: string;  // Новое поле для модалки
  screenshots: string[];    // Фото для нижней части модалки
  editions: GameEdition[];  // Версии игры
  videoUrl?: string;
}

export const ALL_GAMES: Game[] = [
  { 
    id: "2", 
    title: "КИБЕРПАНК 2077", 
    price: 2500, 
    category: "RPG", // Теперь g.category в фильтре не будет ошибкой
    image: "/images/cyber.jpg",
    shortDescription: "Приключенческая ролевая игра в открытом мире Найт-Сити.",
    fullDescription: "Cyberpunk 2077 — это приключенческая ролевая игра, действие которой происходит в мегаполисе Найт-Сити, где власть, роскошь и модификации тела ценятся выше всего. Вы играете за V, наёмника в поисках уникального устройства, позволяющего обрести бессмертие.",
    screenshots: [
      "/images/cyber.jpg", 
      "/images/cyber.jpg", 
      "/images/cyber.jpg"
    ],
    editions: [
      {
        name: "Standard",
        price: 2500,
        features: ["Базовая игра", "Цифровые бонусы"]
      },
      {
        name: "Deluxe",
        price: 3990,
        features: ["Базовая игра", "Дополнение Phantom Liberty", "Саундтрек"]
      }
    ]
  },
  { 
    id: "3", 
    title: "ЭЛДЕН РИНГ", 
    price: 3900, 
    category: "RPG",
    image: "/images/elden.jpg",
    shortDescription: "Восстань, Погасшая душа, и стань владыкой Элдена.",
    fullDescription: "Золотой Порядок разрушен. Восстань, Погасшая душа! Междуземье ждет своего властелина. Овладей силой Кольца Элден и стань владыкой Элдена.",
    screenshots: ["/images/elden.jpg", "/images/elden.jpg", "/images/elden.jpg"],
    editions: [
      { name: "Standard", price: 3900, features: ["Игра"] },
      { name: "SOTE Edition", price: 5490, features: ["Игра", "Shadow of the Erdtree"] }
    ]
  },
  // Остальные игры (1, 4, 5, 6) заполни по аналогии, добавив category и пустые массивы screenshots/editions
];