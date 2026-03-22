"use client";

import React from "react";
import GameCard from "@/components/GameCard";

// Пути исправлены под твою папку public/images/
const GAMES = [
  { id: 1, title: "СТАРФИЛД", price: 4200, image: "/images/starfield.jpg" },
  { id: 2, title: "КИБЕРПАНК 2077", price: 2500, image: "/images/cyber.jpg" },
  { id: 3, title: "ЭЛДЕН РИНГ", price: 3900, image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, image: "/images/gta.jpg" },
  { id: 5, title: "FIFA 24", price: 2499, image: "/images/fifa2024.jpg" },
  { id: 6, title: "ШАХТЕРСКОЕ РЕМЕСЛО", price: 1100, image: "/images/mc.jpg" },
];

export default function Home() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-8 bg-[#a855f7] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter">
            Все игры
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {GAMES.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              title={game.title}
              price={game.price}
              image={game.image}
            />
          ))}
        </div>
      </div>
    </main>
  );
}