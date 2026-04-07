"use client";

import React, { useMemo, useState, useEffect } from "react";
import GameSlider from "@/components/GameSlider";
import HeroBanner from "@/components/HeroBanner";
import AnimatedBackground from "@/components/AnimatedBackground";
import GameModal from "@/components/GameModal";
import { supabase } from "@/lib/supabase"; 
import { ALL_GAMES, type Game, useGamesStore } from "@/store/games";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const setAllGames = useGamesStore((state) => state.setAllGames);

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

        if (error || !data || data.length === 0) {
          setGames(ALL_GAMES);
          setAllGames(ALL_GAMES);
        } else {
          const fetchedGames = data as Game[];
          setGames(fetchedGames);
          setAllGames(fetchedGames);
        }
      } catch (err) {
        setGames(ALL_GAMES);
        setAllGames(ALL_GAMES);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [setAllGames]);

  const getSectionGames = (sectionKey: string) => {
    const filtered = games.filter(g => g.category?.toUpperCase() === sectionKey.toUpperCase());
    return filtered.length === 0 ? [...games].sort(() => Math.random() - 0.5).slice(0, 8) : filtered;
  };

  return (
    /* 1. Убрали pt-42 (слишком много), поставили pt-32.
       2. Убрали !bg-transparent, задали базовый темный фон.
    */
    <main className="relative min-h-screen bg-[#050507] pt-32 pb-24 overflow-x-hidden">
      
      {/* ФОН: всегда -z-10, чтобы быть ПОД контентом */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* КОНТЕНТ: z-10, чтобы быть НАД фоном */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col gap-24 md:gap-32">
        
        {/* БАННЕР: Явно выделяем в секцию */}
        <section className="w-full">
          <HeroBanner />
        </section>

        <div className="flex flex-col gap-16 md:gap-24">
          {loading ? (
            sections.map((s) => (
              <div key={s.key}>
                <GameSlider title={s.title} games={[]} isLoading={true} />
              </div>
            ))
          ) : (
            sections.map((s) => (
              <div key={s.key}>
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