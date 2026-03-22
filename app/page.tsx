"use client";

import React from "react";
import GameCard from "@/components/GameCard";

const BASE_GAMES = [
  { id: 1, title: "СТАРФИЛД", price: 4200, image: "/images/starfield.jpg" },
  { id: 2, title: "КИБЕРПАНК 2077", price: 2500, image: "/images/cyber.jpg" },
  { id: 3, title: "ЭЛДЕН РИНГ", price: 3900, image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, image: "/images/gta.jpg" },
  { id: 5, title: "FIFA 24", price: 2499, image: "/images/fifa2024.jpg" },
  { id: 6, title: "ШАХТЕРСКОЕ РЕМЕСЛО", price: 1100, image: "/images/mc.jpg" },
];

// Генерируем 18 карточек с числовыми ID, чтобы не было ошибки
const LONG_LIST = Array(3).fill(BASE_GAMES).flat().map((game, index) => ({
  ...game,
  id: index + 1 // Теперь ID всегда число
}));

export default function Home() {
  return (
    <main className="min-h-screen pt-32 pb-20 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-8 bg-[#a855f7] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Топ предложения
          </h2>
        </div>

        {/* Свайпер, который не переносится на новые строки */}
        <div className="flex flex-nowrap overflow-x-auto gap-6 pb-10 custom-scrollbar snap-x snap-mandatory">
          {LONG_LIST.map((game) => (
            <div 
              key={game.id} 
              className="min-w-[280px] md:min-w-[320px] snap-start"
            >
              <GameCard {...game} />
            </div>
          ))}
        </div>

        <div className="mt-20 flex items-center gap-4 mb-10">
          <div className="w-1.5 h-8 bg-white/20 rounded-full" />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter opacity-50">
            Недавно добавленные
          </h2>
        </div>
        
        <div className="flex flex-nowrap overflow-x-auto gap-6 pb-10 custom-scrollbar snap-x">
          {[...LONG_LIST].reverse().map((game) => (
            <div key={`rev-${game.id}`} className="min-w-[280px] md:min-w-[320px] snap-start">
              <GameCard {...game} />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}