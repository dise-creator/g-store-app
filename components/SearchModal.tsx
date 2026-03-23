"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Plus } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";

// 1. Описываем тип игры, чтобы TypeScript не ругался на "any"
interface Game {
  id: number;
  title: string;
  price: number;
  image: string;
}

// 2. Данные теперь точно внутри файла
const ALL_GAMES: Game[] = [
  { id: 1, title: "СТАРФИЛД", price: 4200, image: "/images/starfield.jpg" },
  { id: 2, title: "КИБЕРПАНК 2077", price: 2500, image: "/images/cyber.jpg" },
  { id: 3, title: "ЭЛДЕН РИНГ", price: 3900, image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, image: "/images/gta.jpg" },
  { id: 5, title: "FIFA 24", price: 2499, image: "/images/fifa2024.jpg" },
  { id: 6, title: "ШАХТЕРСКОЕ РЕМЕСЛО", price: 1100, image: "/images/mc.jpg" },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const addItem = useCartStore((state) => state.addItem);

  // Очистка при закрытии
  useEffect(() => {
    if (!isOpen) setSearchQuery("");
  }, [isOpen]);

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return ALL_GAMES;
    return ALL_GAMES.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Типизированная функция добавления
  const handleAddToCart = (game: Game) => {
    addItem({
      ...game,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#16161a]/90 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Поиск по магазину</span>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="relative mb-8">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a855f7]" size={18} />
                <input 
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Найти игру..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-14 pr-6 text-white text-sm focus:outline-none focus:border-[#a855f7]/50 transition-all placeholder:text-white/20"
                />
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
                {filteredGames.map((game) => (
                  <motion.div 
                    layout
                    key={game.id}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-14 relative rounded-xl overflow-hidden border border-white/10">
                        <Image src={game.image} alt={game.title} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-tight">{game.title}</h4>
                        <p className="text-[#a855f7] font-black italic text-[11px]">{game.price.toLocaleString()} ₽</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(game)}
                      className="flex items-center gap-2 bg-[#a855f7]/10 hover:bg-[#a855f7] text-[#a855f7] hover:text-white px-4 py-2 rounded-xl border border-[#a855f7]/20 transition-all active:scale-90"
                    >
                      <Plus size={14} />
                      <span className="text-[10px] font-black uppercase italic">В корзину</span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}