"use client";

import React, { useState, useEffect } from "react";
import GameSlider from "@/components/GameSlider";
import HeroBanner from "@/components/HeroBanner";
import { ALL_GAMES } from "@/store/games";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const longList = Array(3).fill(ALL_GAMES).flat().map((game, index) => ({
    ...game,
    id: index + 1
  }));

  return (
    <main className="min-h-screen pt-40 pb-20 bg-transparent animate-fade-in">
      {/* Используем flex-col с gap-16 вместо gap-32, 
         чтобы слайдеры были ближе друг к другу 
      */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col gap-16">
        
        {/* Баннер с дополнительным нижним отступом для баланса */}
        <div className="mb-4">
          <HeroBanner />
        </div>
        
        {/* Секция "Топ предложения" — теперь она ближе к баннеру */}
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