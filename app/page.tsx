"use client";

import React, { useMemo, useState, useEffect } from "react";
import GameSlider from "@/components/GameSlider";
import HeroBanner from "@/components/HeroBanner";
import AnimatedBackground from "@/components/AnimatedBackground";
import SubscriptionSection from "../components/SubscriptionSection";
import { supabase } from "@/lib/supabase";
import { ALL_GAMES, type Game, useGamesStore } from "@/store/games";
import NewsBlock from "@/components/NewsBlock";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, TrendingDown, Clock, Star, X } from "lucide-react";

const CATEGORIES = [
  { key: "ALL", label: "Все игры" },
  { key: "RPG", label: "RPG" },
  { key: "FPS", label: "Шутеры" },
  { key: "SIM", label: "Симуляторы" },
  { key: "INDIE", label: "Инди" },
  { key: "NEW", label: "Новинки" },
];

const SORT_OPTIONS = [
  { key: "newest", label: "Новинки", icon: Clock },
  { key: "price_asc", label: "Дешевле", icon: TrendingDown },
  { key: "price_desc", label: "Дороже", icon: Star },
  { key: "discount", label: "Скидки", icon: Star },
];

const SECTIONS = [
  { title: "RPG и Приключения", key: "RPG" },
  { title: "Шутеры", key: "FPS" },
  { title: "Симуляторы", key: "SIM" },
  { title: "Новинки", key: "NEW" },
];

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeSort, setActiveSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const setAllGames = useGamesStore((state) => state.setAllGames);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("games")
          .select("*")
          .order("created_at", { ascending: false });

        const loaded = (!error && data?.length) ? data as Game[] : ALL_GAMES;
        setGames(loaded);
        setAllGames(loaded);
      } catch {
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
    return filtered.length > 0 ? filtered : games.slice(0, 8);
  };

  const filteredGames = useMemo(() => {
    let result = activeCategory === "ALL"
      ? [...games]
      : games.filter(g => g.category?.toUpperCase() === activeCategory);

    switch (activeSort) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "discount": result.sort((a, b) => (b.discount_percent ?? 0) - (a.discount_percent ?? 0)); break;
    }
    return result;
  }, [games, activeCategory, activeSort]);

  const isFiltered = activeCategory !== "ALL" || activeSort !== "newest";

  const resetFilters = () => { setActiveCategory("ALL"); setActiveSort("newest"); };

  return (
    <main className="relative min-h-screen pt-28 md:pt-32 pb-24 overflow-x-hidden">

      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col gap-16 md:gap-24">

        <section className="w-full">
          <HeroBanner />
        </section>

        <NewsBlock />

        {/* Фильтры */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all shrink-0 ${
                    activeCategory === cat.key
                      ? "text-black"
                      : "text-white/40 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20"
                  }`}
                >
                  {activeCategory === cat.key && (
                    <motion.div
                      layoutId="category-bg"
                      className="absolute inset-0 bg-[#63f3f7] rounded-2xl"
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shrink-0 transition-all border ${
                showFilters || activeSort !== "newest"
                  ? "bg-[#63f3f7]/10 border-[#63f3f7]/30 text-[#63f3f7]"
                  : "bg-white/[0.03] border-white/10 text-white/40 hover:text-white"
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:block">Сортировка</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 p-4 bg-white/[0.03] border border-white/10 rounded-2xl flex-wrap">
                  <span className="text-white/20 text-[10px] uppercase font-black tracking-widest mr-2">Сортировать:</span>
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setActiveSort(opt.key)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        activeSort === opt.key
                          ? "bg-[#63f3f7] text-black border-transparent"
                          : "bg-white/[0.03] border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isFiltered && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={resetFilters}
                className="flex items-center gap-2 w-fit px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
              >
                <X size={12} />
                Сбросить фильтры
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Контент */}
        <div className="flex flex-col gap-12 md:gap-20">
          {loading ? (
            SECTIONS.map((s) => (
              <GameSlider key={s.key} title={s.title} games={[]} isLoading={true} />
            ))
          ) : isFiltered ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <GameSlider
                title={CATEGORIES.find(c => c.key === activeCategory)?.label ?? "Все игры"}
                games={filteredGames}
              />
              {filteredGames.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <p className="text-white/20 font-black uppercase text-xl">Ничего не найдено</p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-[#63f3f7] text-black font-black uppercase text-xs rounded-2xl"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <>
              <GameSlider
                title={SECTIONS[0].title}
                games={getSectionGames(SECTIONS[0].key)}
              />
              <section className="w-full">
                <SubscriptionSection />
              </section>
              {SECTIONS.slice(1).map((s) => (
                <GameSlider
                  key={s.key}
                  title={s.title}
                  games={getSectionGames(s.key)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}