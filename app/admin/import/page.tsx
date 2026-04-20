"use client";

import React, { useState } from "react";
import { Search, Plus, Check, Loader2, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const RAWG_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

interface RawgGame {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  genres: { name: string }[];
  platforms: { platform: { name: string } }[];
  description_raw?: string;
  short_screenshots: { image: string }[];
}

const CATEGORY_MAP: Record<string, string> = {
  "Action": "FPS",
  "Shooter": "FPS",
  "Role playing games (RPG)": "RPG",
  "Adventure": "RPG",
  "Simulation": "SIM",
  "Sports": "SIM",
  "Racing": "SIM",
  "Indie": "INDIE",
  "Puzzle": "INDIE",
  "Strategy": "INDIE",
};

export default function ImportPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [addingId, setAddingId] = useState<number | null>(null);
  const [price, setPrice] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(
        `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=12&platforms=18,187`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (e) {
      setError("Ошибка поиска — проверь API ключ");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (id: number): Promise<RawgGame> => {
    const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${RAWG_KEY}`);
    return res.json();
  };

  const handleAdd = async (game: RawgGame) => {
    const gamePrice = parseInt(price[game.id] || "0");
    if (!gamePrice) {
      alert("Введи цену!");
      return;
    }

    setAddingId(game.id);
    setError(null);

    try {
      const details = await fetchDetails(game.id);
      const genre = details.genres?.[0]?.name || "Action";
      const category = CATEGORY_MAP[genre] || "RPG";
      const screenshots = details.short_screenshots?.map((s: any) => s.image) || [];

      const { error: insertError } = await supabase.from("games").insert({
        title: game.name.toUpperCase(),
        price: gamePrice,
        category,
        image: game.background_image,
        description: details.description_raw?.slice(0, 200) || "",
        full_description: details.description_raw || "",
        screenshots: screenshots.slice(0, 5),
        editions: [{
          name: "Standard",
          price: gamePrice,
          features: ["Базовая игра"]
        }],
        discount_percent: 0,
      });

      if (insertError) {
        console.error("Supabase error:", insertError);
        setError(`Ошибка: ${insertError.message}`);
      } else {
        setAddedIds(prev => new Set([...prev, game.id]));
      }
    } catch (e) {
      console.error(e);
      setError("Ошибка при добавлении игры");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <main className="min-h-screen pt-10 pb-20 px-8">
      <div className="max-w-[1200px] mx-auto">

        {/* Шапка */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#63f3f7] transition-all"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
              Импорт <span className="text-[#63f3f7]">игр</span>
            </h1>
            <p className="text-white/30 text-xs mt-1">Поиск через RAWG API — одна кнопка добавляет игру в базу</p>
          </div>
        </div>

        {/* Поиск */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="Введи название игры..."
              className="w-full pl-11 pr-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/20 font-bold text-sm focus:outline-none focus:border-[#63f3f7]/40 transition-all"
            />
          </div>
          <button
            onClick={search}
            disabled={loading}
            className="px-8 py-4 bg-[#63f3f7] text-black font-black text-sm uppercase italic rounded-2xl hover:shadow-[0_0_20px_rgba(99,243,247,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Найти
          </button>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold">
            {error}
          </div>
        )}

        {/* Результаты */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {results.map((game, i) => {
                const isAdded = addedIds.has(game.id);
                const isAdding = addingId === game.id;

                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col gap-2"
                  >
                    {/* Обложка */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02]">
                      {game.background_image ? (
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 text-xs text-center p-2">
                          Нет фото
                        </div>
                      )}
                      {isAdded && (
                        <div className="absolute inset-0 bg-[#63f3f7]/20 flex items-center justify-center">
                          <Check size={32} className="text-[#63f3f7]" />
                        </div>
                      )}
                    </div>

                    {/* Название */}
                    <p className="text-white/80 text-[10px] font-black uppercase italic truncate">{game.name}</p>

                    {/* Цена */}
                    <input
                      type="number"
                      value={price[game.id] || ""}
                      onChange={e => setPrice(prev => ({ ...prev, [game.id]: e.target.value }))}
                      placeholder="Цена ₽"
                      className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-[#63f3f7]/40 transition-all placeholder-white/20"
                    />

                    {/* Кнопка */}
                    <button
                      onClick={() => handleAdd(game)}
                      disabled={isAdded || isAdding}
                      className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase italic tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        isAdded
                          ? "bg-[#63f3f7]/10 border border-[#63f3f7]/20 text-[#63f3f7] cursor-default"
                          : isAdding
                          ? "bg-white/5 border border-white/10 text-white/30 cursor-wait"
                          : "bg-[#63f3f7] text-black hover:shadow-[0_0_15px_rgba(99,243,247,0.3)] active:scale-95"
                      }`}
                    >
                      {isAdded ? (
                        <><Check size={12} /> Добавлено</>
                      ) : isAdding ? (
                        <><Loader2 size={12} className="animate-spin" /> Добавляем...</>
                      ) : (
                        <><Plus size={12} /> Добавить</>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && results.length === 0 && query && (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <p className="text-white/20 text-sm font-black uppercase">Ничего не найдено</p>
          </div>
        )}
      </div>
    </main>
  );
}