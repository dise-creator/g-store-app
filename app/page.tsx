"use client";

import React, { useMemo, useState, useEffect } from "react";
import GameSlider from "@/components/GameSlider";
import HeroBanner from "@/components/HeroBanner";
import AnimatedBackground from "@/components/AnimatedBackground";
import GameModal from "@/components/GameModal";
import { supabase } from "@/lib/supabase"; 
import { ALL_GAMES, type Game } from "@/store/games";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const sections = useMemo(() => [
    { title: "RPG и Приключения", key: "RPG" },
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
          setGames(ALL_GAMES); 
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

  const getSectionGames = (sectionKey: string) => {
    const filtered = games.filter(g => g.category?.toUpperCase() === sectionKey.toUpperCase());
    if (filtered.length === 0) {
      return [...games].sort(() => Math.random() - 0.5).slice(0, 8);
    }
    return filtered;
  };

  return (
    // ИСПРАВЛЕНО: Увеличили pt-32 до pt-52 для значительного отступа от хедера
    <main className="relative min-h-screen !bg-transparent pt-42 pb-24 overflow-x-hidden">
      <AnimatedBackground />

      {/* Контейнер с боковыми отступами md:px-10 */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col gap-24 md:gap-32">
        
        {/* ИСПРАВЛЕНО: Добавлен mt-8 для дополнительного расстояния между хедером и баннером */}
        <section className="w-full mt-8">
          <HeroBanner />
        </section>

        {/* Слайдеры с компактными отступами gap */}
        <div className="flex flex-col gap-16 md:gap-24">
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
                  onSelectGame={(game) => console.log("Selected:", game.title)} 
                />
              </div>
            ))
          )}
        </div>
      </div>

      <GameModal /> 
    </main>
  );
}