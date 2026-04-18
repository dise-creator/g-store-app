"use client";

import React, { useMemo, useState, useEffect } from "react";
import GameSlider from "@/components/GameSlider";
import HeroBanner from "@/components/HeroBanner";
import AnimatedBackground from "@/components/AnimatedBackground";
import GameModal from "@/components/GameModal";
import SubscriptionSection from "../components/SubscriptionSection";
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
    <main className="relative min-h-screen bg-[#050507] pt-32 pb-24 overflow-x-hidden">
      
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col gap-24 md:gap-32">
        
        {/* Баннер */}
        <section className="w-full">
          <HeroBanner />
        </section>

        {/* Слайдеры + подписки */}
        <div className="flex flex-col gap-16 md:gap-24">
          {loading ? (
            sections.map((s) => (
              <div key={s.key}>
                <GameSlider title={s.title} games={[]} isLoading={true} />
              </div>
            ))
          ) : (
            <>
              {/* RPG и Приключения */}
              <GameSlider
                title={sections[0].title}
                games={getSectionGames(sections[0].key)}
                onSelectGame={(game) => console.log("Selected:", game.title)}
              />

              {/* Подписки PS Plus — между RPG и Шутерами */}
              <section className="w-full">
                <SubscriptionSection />
              </section>

              {/* Шутеры, Симуляторы, Новинки */}
              {sections.slice(1).map((s) => (
                <GameSlider
                  key={s.key}
                  title={s.title}
                  games={getSectionGames(s.key)}
                  onSelectGame={(game) => console.log("Selected:", game.title)}
                />
              ))}
            </>
          )}
        </div>

      </div>

      <GameModal /> 
    </main>
  );
}