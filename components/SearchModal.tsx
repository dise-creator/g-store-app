"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";
import type { Game } from "@/store/games";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
}

// Улучшенный словарь: теперь он помогает искать английские игры по русским запросам и наоборот
const searchMap: Record<string, string> = {
  "Cyberpunk 2077": "Киберпанк 2077 cp77 cp 2077",
  "КИБЕРПАНК 2077": "Cyberpunk 2077 cp77 cp 2077", // на случай если в БД на русском
  "Counter-Strike 2": "Контр Страйк 2 кс cs cs2",
  "Minecraft": "Майнкрафт mc мс",
  "MINECRAFT": "Майнкрафт mc мс",
  "Elden Ring": "Элден Ринг",
  "ELDEN RING": "Элден Ринг",
  "Grand Theft Auto V": "ГТА 5 gta 5 gta5 gta v",
  "GTA V": "ГТА 5 gta 5 gta5 gta v",
  "Starfield": "Старфилд",
  "STARFIELD": "Старфилд"
};

export default function SearchModal({ isOpen, onClose, games = [] }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem, items } = useCartStore();

  const isInCart = (gameId: string) => items.some(item => String(item.id) === String(gameId));

  const displayGames = useMemo(() => {
    // Чистим строку от мусора для сравнения
    const clean = (str: string) => 
      str.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim();

    const query = clean(searchQuery);

    if (query.length > 0) {
      return games
        .filter((game) => {
          const mainTitle = clean(game.title);
          const mappedTitle = clean(searchMap[game.title] || searchMap[game.title.toUpperCase()] || "");
          
          // Ищем совпадение в оригинальном названии ИЛИ в расширенном словаре (алиасах)
          return mainTitle.includes(query) || mappedTitle.includes(query);
        })
        .sort((a, b) => {
          // Умная сортировка: те, кто начинается на запрос, летят в топ
          const aTitle = clean(a.title);
          const bTitle = clean(b.title);
          const aMapped = clean(searchMap[a.title] || searchMap[a.title.toUpperCase()] || "");
          const bMapped = clean(searchMap[b.title] || searchMap[b.title.toUpperCase()] || "");
          
          const aStarts = aTitle.startsWith(query) || aMapped.startsWith(query);
          const bStarts = bTitle.startsWith(query) || bMapped.startsWith(query);
          
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return 0;
        });
    }
    
    // Если ничего не введено — показываем 5 случайных игр
    return [...games].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [searchQuery, games]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-[#0a0a0c]/95 backdrop-blur-xl flex flex-col"
        >
          {/* Поле ввода */}
          <div className="w-full max-w-[900px] mx-auto px-6 py-8 flex items-center gap-4">
            <div className="relative flex-1 group">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#63f3f7] transition-colors" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Поиск (RU / EN)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-lg text-white outline-none focus:border-[#63f3f7]/40 transition-all font-bold uppercase italic tracking-tighter"
              />
            </div>
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all text-[10px] font-black"
            >
              ESC
            </button>
          </div>

          {/* Результаты */}
          <div className="flex-1 overflow-y-auto px-6 pb-20">
            <div className="max-w-[900px] mx-auto flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2 ml-2">
                {searchQuery.length > 0 ? "Результаты поиска" : "Попробуйте найти"}
              </p>

              {displayGames.map((game) => {
                const added = isInCart(game.id);
                return (
                  <motion.div 
                    layout 
                    key={game.id} 
                    className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-2xl p-3 hover:bg-white/[0.06] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-white/5">
                        <Image 
                          src={game.image} 
                          alt={game.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                          unoptimized 
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase italic text-white leading-none">
                          {game.title}
                        </h3>
                        <p className="text-[#63f3f7] text-xs font-black italic mt-1">{game.price.toLocaleString()} ₽</p>
                      </div>
                    </div>
                    <button
                      onClick={() => !added && addItem(game)}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase italic transition-all ${
                        added 
                          ? "bg-[#63f3f7] text-black shadow-[0_0_15px_#63f3f7]" 
                          : "bg-white/5 text-white/40 border border-white/5 hover:bg-[#63f3f7]/20 hover:text-[#63f3f7]"
                      }`}
                    >
                      {added ? "Добавлено" : "В корзину"}
                    </button>
                  </motion.div>
                );
              })}
              
              {searchQuery.length > 0 && displayGames.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-white/10 uppercase italic font-black text-2xl tracking-tighter">Игры не найдены</p>
                  <p className="text-white/5 text-xs uppercase mt-2">Попробуйте ввести другое название</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}