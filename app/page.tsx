"use client";

import React from "react";
import GameSlider from "@/components/GameSlider";

const BASE_GAMES = [
  { id: 1, title: "СТАРФИЛД", price: 4200, image: "/images/starfield.jpg" },
  { id: 2, title: "КИБЕРПАНК 2077", price: 2500, image: "/images/cyber.jpg" },
  { id: 3, title: "ЭЛДЕН РИНГ", price: 3900, image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, image: "/images/gta.jpg" },
  { id: 5, title: "FIFA 24", price: 2499, image: "/images/fifa2024.jpg" },
  { id: 6, title: "ШАХТЕРСКОЕ РЕМЕСЛО", price: 1100, image: "/images/mc.jpg" },
];

// Фикс типов: превращаем в массив с числовыми ID
const LONG_LIST = Array(3).fill(BASE_GAMES).flat().map((game, index) => ({
  ...game,
  id: index + 1
}));

export default function Home() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#0a0a0b] overflow-x-hidden">
      {/* max-w-[1400px] — это ширина твоего хедера. 
        Благодаря этому свайперы будут выровнены идеально.
      */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 flex flex-col gap-24">
        
        <GameSlider 
          title="Топ предложения" 
          games={LONG_LIST} 
        />

        <GameSlider 
          title="Недавно добавленные" 
          games={[...LONG_LIST].reverse()} 
        />

      </div>
    </main>
  );
}