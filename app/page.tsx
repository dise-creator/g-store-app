"use client";

import React, { useMemo, useState, useEffect } from "react";
import GameSlider from "@/components/GameSlider";
import HeroBanner from "@/components/HeroBanner";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabase"; 
import type { Game } from "@/store/games";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Ключи (key) должны совпадать с тем, что ты пишешь в колонку category в Supabase
  const sections = useMemo(() => [
    { title: "Новинки", key: "new" },
    { title: "Популярное", key: "trending" },
    { title: "Шутеры", key: "fps" },
    { title: "RPG и Приключения", key: "rpg" },
    { title: "Симуляторы", key: "sim" },
    { title: "Инди-хиты", key: "indie" }
  ], []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Ошибка загрузки данных:", error.message);
      } else if (data) {
        setGames(data as Game[]);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  // ИСПРАВЛЕННАЯ ФУНКЦИЯ: теперь она фильтрует игры
  const getSectionGames = (sectionKey: string) => {
    // 1. Пытаемся найти игры именно этой категории
    const filtered = games.filter(g => g.category === sectionKey);
    
    // 2. Если в категории пусто, показываем случайные игры (чтобы сайт не был пустым),
    // но ограничиваем их количество, чтобы не было гигантских дублей
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
                  // Передаем отфильтрованные игры
                  games={getSectionGames(s.key)} 
                />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}