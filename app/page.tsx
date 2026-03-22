"use client";

import React, { useState, useEffect } from "react";
import GameSlider from "@/components/GameSlider";

// Исходные данные для игр
const BASE_GAMES = [
  { id: 1, title: "СТАРФИЛД", price: 4200, image: "/images/starfield.jpg" },
  { id: 2, title: "КИБЕРПАНК 2077", price: 2500, image: "/images/cyber.jpg" },
  { id: 3, title: "ЭЛДЕН РИНГ", price: 3900, image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, image: "/images/gta.jpg" },
  { id: 5, title: "FIFA 24", price: 2499, image: "/images/fifa2024.jpg" },
  { id: 6, title: "ШАХТЕРСКОЕ РЕМЕСЛО", price: 1100, image: "/images/mc.jpg" },
];

const LONG_LIST = Array(3).fill(BASE_GAMES).flat().map((game, index) => ({
  ...game,
  id: index + 1
}));

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    /* Убрал bg-[#0a0a0b], теперь виден градиент из globals.css */
    <main className="min-h-screen pt-32 pb-20 overflow-x-hidden bg-transparent">
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 flex flex-col gap-24">
        
        {/* Секция "Топ предложения" */}
        <GameSlider 
          title="Топ предложения" 
          games={LONG_LIST} 
          isLoading={isLoading} 
        />

        {/* Секция "Недавно добавленные" */}
        <GameSlider 
          title="Недавно добавленные" 
          games={[...LONG_LIST].reverse()} 
          isLoading={isLoading} 
        />

      </div>
    </main>
  );
}