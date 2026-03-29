"use client";

import React, { useMemo, useState, useEffect } from "react";
import GameSlider from "@/components/GameSlider";
import HeroBanner from "@/components/HeroBanner";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ALL_GAMES } from "@/store/games";

export default function Home() {
  // Состояние для хранения перемешанных игр для каждой секции
  const [shuffledSections, setShuffledSections] = useState<any[]>([]);

  const sections = useMemo(() => [
    { title: "Новинки", key: "new" },
    { title: "Популярное", key: "trending" },
    { title: "Шутеры", key: "fps" },
    { title: "RPG и Приключения", key: "rpg" },
    { title: "Симуляторы", key: "sim" },
    { title: "Инди-хиты", key: "indie" }
  ], []);

  // Перемешиваем игры только один раз при загрузке на клиенте
  useEffect(() => {
    const data = sections.map(s => ({
      ...s,
      games: [...ALL_GAMES].sort(() => Math.random() - 0.5)
    }));
    setShuffledSections(data);
  }, [sections]);

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
          {shuffledSections.length > 0 ? (
            shuffledSections.map((s) => (
              <div key={s.key} className="bg-transparent">
                <GameSlider 
                  title={s.title} 
                  games={s.games} 
                />
              </div>
            ))
          ) : (
            // Скелетоны или заглушка на время перемешивания
            sections.map((s) => (
              <div key={s.key}>
                <GameSlider title={s.title} games={[]} isLoading={true} />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}