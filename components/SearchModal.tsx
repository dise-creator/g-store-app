"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useCartStore } from "../store/useCart";
import GameCard from "./GameCard";

// Тестовые данные для поиска
const MOCK_GAMES = [
  { id: 1, title: "Starfield", price: 4200, discount: "-10%", image: "/images/starfield.jpg" },
  { id: 2, title: "Cyberpunk 2077", price: 2500, discount: "-50%", image: "/images/cyber.jpg" },
  { id: 3, title: "Elden Ring", price: 3900, discount: "-20%", image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, discount: "-60%", image: "/images/gta.jpg" },
  { id: 5, title: "Spider-Man 2", price: 9795, discount: "-10%", image: "/images/spider.jpg" },
  { id: 6, title: "Minecraft", price: 2795, discount: "-5%", image: "/images/mc.jpg" },
];

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useCartStore();
  const [query, setQuery] = useState("");

  // Фильтрация игр по запросу
  const results = MOCK_GAMES.filter((g) =>
    g.title.toLowerCase().includes(query.toLowerCase())
  );

  // Закрытие по нажатию Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && closeSearch();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeSearch]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          {/* Задний фон с блюром */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="absolute inset-0 bg-black/40 backdrop-blur-xl"
          />

          {/* Само модальное окно */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-[#1e2530] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden shadow-black/50"
          >
            {/* Поле поиска */}
            <div className="p-6 border-b border-white/5 bg-[#1a212c]">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#a855f7] transition-colors" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Найти игру или подписку..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#a855f7]/50 transition-all text-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  onClick={closeSearch}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Результаты с анимацией появления каждой карточки */}
            <div className="p-8 max-h-[70vh] overflow-y-auto bg-[#13171f] custom-scrollbar">
              <h4 className="text-gray-500 font-bold uppercase text-[11px] tracking-[0.2em] mb-8">
                {query ? `Найдено: ${results.length}` : "Сейчас ищут"}
              </h4>

              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              >
                {results.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }} // Эффект каскадного появления
                  >
                    <GameCard 
                      id={game.id}
                      title={game.title}
                      price={game.price}
                      discount={game.discount}
                      image={game.image}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {results.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-gray-600 italic"
                >
                  По вашему запросу ничего не найдено
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}