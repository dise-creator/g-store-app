"use client";
import React, { useMemo } from "react";
import GameSlider from "@/components/GameSlider";
import HeroBanner from "@/components/HeroBanner";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ALL_GAMES } from "@/store/games";

export default function Home() {
  // Генерируем много секций для бесконечного скролла
  const sections = useMemo(() => [
    { title: "Новинки", key: "new" },
    { title: "Популярное", key: "trending" },
    { title: "Шутеры", key: "fps" },
    { title: "RPG и Приключения", key: "rpg" },
    { title: "Симуляторы", key: "sim" },
    { title: "Инди-хиты", key: "indie" }
  ], []);

  return (
    <main className="relative min-h-screen !bg-transparent pt-32 pb-24">
      {/* Стеклянный фон */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 flex flex-col gap-32">
        {/* Главный баннер */}
        <section>
          <HeroBanner />
        </section>

        {/* Много слайдеров с играми */}
        <div className="flex flex-col gap-28">
          {sections.map((s) => (
            <div key={s.key} className="bg-transparent">
              <GameSlider 
                title={s.title} 
                // Рандомим игры для каждой секции, чтобы они отличались
                games={[...ALL_GAMES].sort(() => Math.random() - 0.5)} 
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}