"use client";

import React, { useMemo, useState, useEffect } from "react";
import GameSlider from "@/components/GameSlider";
import HeroBanner from "@/components/HeroBanner";
import AnimatedBackground from "@/components/AnimatedBackground";
import GameModal from "@/components/GameModal";
import { supabase } from "@/lib/supabase"; 
import { ALL_GAMES, type Game } from "@/store/games"; // Добавили ALL_GAMES как запасной вариант

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Исправляем ключи секций, чтобы они совпадали с теми, что мы прописали в store/games.ts
  const sections = useMemo(() => [
    { title: "RPG и Приключения", key: "RPG" }, // Ключ должен быть как в базе/сторе
    { title: "Шутеры", key: "FPS" },
    { title: "Симуляторы", key: "SIM" },
    { title: "Новинки", key: "NEW" },
  ], []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn("Supabase error, using local fallback:", error.message);
          setGames(ALL_GAMES); // Если база пуста или ошибка, берем данные из файла
        } else if (data && data.length > 0) {
          setGames(data as Game[]);
        } else {
          setGames(ALL_GAMES);
        }
      } catch (err) {
        setGames(ALL_GAMES);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Теперь типизация g.category будет работать корректно, 
  // так как мы обновили интерфейс Game в store/games.ts
  const getSectionGames = (sectionKey: string) => {
    const filtered = games.filter(g => g.category?.toUpperCase() === sectionKey.toUpperCase());
    
    // Если в категории пусто, показываем любые 4 игры, чтобы секция не была пустой
    if (filtered.length === 0) {
      return [...games].sort(() => Math.random() - 0.5).slice(0, 4);
    }
    return filtered;
  };

  return (
    <main className="relative min-h-screen !bg-transparent pt-32 pb-24">
      <AnimatedBackground />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 flex flex-col gap-32">
        <section>
          <HeroBanner />
        </section>

        <div className="flex flex-col gap-28">
          {loading ? (
            sections.map((s) => (
              <div key={s.key}>
                <GameSlider title={s.title} games={[]} isLoading={true} />
              </div>
            ))
          ) : (
            sections.map((s) => (
              <div key={s.key} className="bg-transparent">
                <GameSlider 
                  title={s.title} 
                  games={getSectionGames(s.key)} 
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Модалка теперь будет получать корректные данные g.category и описание */}
      <GameModal /> 
    </main>
  );
}