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
  title: "ELDEN RING", 
  price: 3990, 
  category: "RPG",
  // Главное превью (карточка и фон модалки)
  image: "/images/elden_main.jpg", 
  shortDescription: "Восстань, Погасшая душа, и стань владыкой Элдена в Междуземье.",
  fullDescription: "Золотой Порядок разрушен. В Междуземье владычествует хаос, а осколки Кольца Элдена попали в руки безумных полубогов. Вам предстоит пройти через туманные земли, сразить легендарных врагов и решить судьбу этого мира в самом амбициозном приключении от FromSoftware.",
  
  // Эти картинки появятся внизу модалки в сетке
  screenshots: [
    "/images/elden.jpg", 
    "/images/cyber.jpg",
    "/images/mc.jpg",
    "/images/gta.jpg"
  ],
  
  // Эти версии появятся в переключателе модалки
  editions: [
    { 
      name: "Standard", 
      price: 3990, 
      features: ["Базовая игра"] 
    },
    { 
      name: "Shadow Edition", 
      price: 5990, 
      features: ["Базовая игра", "Дополнение Shadow of the Erdtree", "Цифровой артбук"] 
    }
  ]
},
  { 
  id: "5", 
  title: "MINECRAFT", 
  price: 1500, 
  category: "Sandbox", // Обязательное поле для фильтрации
  image: "/images/mc.jpg",
  shortDescription: "Строй, выживай и исследуй бесконечные миры из блоков.",
  fullDescription: "Minecraft — это игра о расстановке блоков и поиске приключений. Постройте всё, что только сможете вообразить, используя неограниченные ресурсы в творческом режиме, или отправляйтесь в грандиозные экспедиции в режиме выживания.",
  screenshots: [
    "/images/mc.jpg", // Используй те, что есть в папке public/images
    "/images/starfield.jpg" // Для теста можно подставить любую другую
  ],
  editions: [
    { 
      name: "Java Edition", 
      price: 1500, 
      features: ["Классическая версия", "Поддержка модов"] 
    },
    { 
      name: "Deluxe Collection", 
      price: 2800, 
      features: ["Java & Bedrock", "1600 жетонов", "Набор скинов"] 
    }
  ]
},

{ 
  id: "4", 
  title: "GTA V", 
  price: 1990, 
  category: "Action",
  image: "/images/gta.jpg",
  shortDescription: "Криминальный триллер в открытом мире Лос-Сантоса.",
  fullDescription: "Чтобы провести серию дерзких ограблений и выжить в большом городе, уличному ловкачу, отставному грабителю банков и опасному психопату приходится иметь дело с самыми пугающими и сумасшедшими представителями криминального мира.",
  screenshots: ["/images/gta.jpg", "/images/cyber.jpg"],
  editions: [
    { 
      name: "Premium Edition", 
      price: 1990, 
      features: ["Сюжетный режим", "GTA Online", "Набор 'Преступная организация'"] 
    }
  ]
},

{ 
  id: "6", 
  title: "STARFIELD", 
  price: 4500, 
  category: "Sci-Fi", 
  image: "/images/starfield.jpg",
  shortDescription: "Ролевая игра нового поколения в открытом космосе.",
  fullDescription: "В этой игре от Bethesda Game Studios вы сможете создать любого персонажа и исследовать вселенную так, как вам хочется. Вас ждут более 1000 планет, захватывающие сражения и тайны человечества.",
  screenshots: [
    "/images/starfield.jpg", 
    "/images/cyber.jpg" // Пока используем то, что есть в папке public
  ],
  editions: [
    { 
      name: "Standard", 
      price: 4500, 
      features: ["Базовая игра"] 
    },
    { 
      name: "Constellation", 
      price: 9900, 
      features: ["Базовая игра", "Сюжетное дополнение", "Часы Chronomark"] 
    }
  ]
},

];