"use client";

import React, { useState } from "react";
import { useGamesStore } from "@/store/games";
import { useRegionStore } from "@/store/useRegion";
import GameCard from "@/components/GameCard";
import { useGameModal } from "@/store/useGameModal";
import { Search } from "lucide-react";

const CATEGORIES = ["Все", "PS5", "PS4", "Indie", "Action", "RPG", "Sport", "Racing"];

export default function CatalogPage() {
  const { allGames } = useGamesStore();
  const { openModal } = useGameModal();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");

  const filtered = allGames.filter((game) => {
    const matchSearch = game.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "Все" || game.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 max-w-[1620px] mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-8 bg-[#63f3f7] rounded-full shadow-[0_0_15px_#63f3f7]" />
        <h1 className="text-2xl md:text-4xl font-michroma text-white uppercase tracking-[0.15em] font-black">
          Каталог
        </h1>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Найти игру..."
          className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/10 focus:border-[#63f3f7]/40 rounded-2xl text-white text-sm outline-none transition-all placeholder-white/20 font-bold"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            style={{
              background: activeCategory === cat ? "rgba(99,243,247,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeCategory === cat ? "rgba(99,243,247,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: activeCategory === cat ? "#63f3f7" : "rgba(255,255,255,0.4)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-white/20 font-black uppercase tracking-widest">
          Игры не найдены
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onSelect={() => openModal(game)}
            />
          ))}
        </div>
      )}
    </div>
  );
}