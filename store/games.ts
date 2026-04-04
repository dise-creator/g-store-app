export interface Game {
  id: string; // Тип изменен на string для совместимости с Supabase
  title: string;
  price: number;
  image: string;
  description: string; 
  videoUrl?: string;   
  category?: string;
}

export const ALL_GAMES: Game[] = [
  { 
    id: "1", 
    title: "СТАРФИЛД", 
    price: 4200, 
    image: "/images/starfield.jpg",
    description: "Исследуйте глубины космоса в новой ролевой игре от создателей Skyrim." 
  },
  { 
    id: "2", 
    title: "КИБЕРПАНК 2077", 
    price: 2500, 
    image: "/images/cyber.jpg",
    description: "Приключенческая ролевая игра в открытом мире Найт-Сити."
  },
  { 
    id: "3", 
    title: "ЭЛДЕН РИНГ", 
    price: 3900, 
    image: "/images/elden.jpg",
    description: "Восстань, Погасшая душа, и стань владыкой Элдена в Междуземье." 
  },
  { 
    id: "4", 
    title: "GTA V", 
    price: 1200, 
    image: "/images/gta.jpg",
    description: "Криминальный боевик в Лос-Сантосе." 
  },
  { 
    id: "5", 
    title: "FIFA 24", 
    price: 2499, 
    image: "/images/fifa2024.jpg",
    description: "Самый реалистичный симулятор футбола." 
  },
  { 
    id: "6", 
    title: "ШАХТЕРСКОЕ РЕМЕСЛО", 
    price: 1100, 
    image: "/images/mc.jpg",
    description: "Бесконечный мир для вашего творчества и выживания." 
  },
];