"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon, Check, Plus } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";

interface Game {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
}

export default function SearchModal({ isOpen, onClose, games = [] }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem, items } = useCartStore();

  // 1. Закрытие через ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const isInCart = (gameId: number) => items.some(item => item.id === gameId);

  // 2. Логика фильтрации + Рандомные игры
  const displayGames = useMemo(() => {
    if (searchQuery.length > 0) {
      return games.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Если поиск пуст — берем 5 рандомных игр
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
          {/* Компактная шапка */}
          <div className="w-full max-w-[900px] mx-auto px-6 py-8 flex items-center gap-4">
            <div className="relative flex-1 group">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#a855f7] transition-colors" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Поиск игр..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-lg text-white outline-none focus:border-[#a855f7]/40 focus:bg-white/[0.07] transition-all font-bold uppercase italic tracking-tighter"
              />
            </div>
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-red-500/20 transition-all text-xs font-bold"
            >
              ESC
            </button>
          </div>

          {/* Список результатов */}
          <div className="flex-1 overflow-y-auto px-6 pb-20">
            <div className="max-w-[900px] mx-auto flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2 ml-2">
                {searchQuery.length > 0 ? "Результаты поиска" : "Возможно, вам понравится"}
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
                        <Image src={game.image} alt={game.title} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase italic text-white leading-none">{game.title}</h3>
                        <p className="text-[#a855f7] text-xs font-black italic mt-1">{game.price.toLocaleString()} ₽</p>
                      </div>
                    </div>

                    <button
                      onClick={() => !added && addItem(game)}
                      className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase italic transition-all duration-300
                        ${added 
                          ? "bg-[#a855f7] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]" 
                          : "bg-white/5 text-white/40 border border-white/5 hover:bg-[#a855f7]/20 hover:text-[#a855f7]"
                        }
                      `}
                    >
                      {added ? (
                        <><Check size={14} strokeWidth={4} /> Добавлено</>
                      ) : (
                        <><Plus size={14} /> В корзину</>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}