"use client";

import React, { useState, useEffect } from "react";
import GameSlider from "@/components/GameSlider";
import { ALL_GAMES } from "@/store/games"; // Импортируем из общего места

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Создаем длинный список для слайдеров
  const longList = Array(3).fill(ALL_GAMES).flat().map((game, index) => ({
    ...game,
    id: index + 1
  }));

  return (
    <main className="min-h-screen pt-32 pb-20 bg-transparent animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col gap-32">
        
        {/* Секция "Топ предложения" */}
        <section>
          <GameSlider 
            title="Топ предложения" 
            games={longList} 
            isLoading={isLoading} 
          />
        </section>

        {/* Секция "Недавно добавленные" */}
        <section>
          <GameSlider 
            title="Недавно добавленные" 
            games={[...longList].reverse()} 
            isLoading={isLoading} 
          />
        </section>

      </div>
    </main>
  );
}