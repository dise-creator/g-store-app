"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import Image from "next/image";

const GAMES = [
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
  const [query, setQuery] = useState("");
  const addItem = useCartStore((state) => state.addItem);
  const inputRef = useRef<HTMLInputElement>(null);

  // Esc и автофокус
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      setQuery("");
    };
  }, [isOpen, onClose]);

  const displayGames = useMemo(() => {
    if (!query.trim()) return GAMES;
    return GAMES.filter(g => g.title.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-[#0a0a0b]/98 backdrop-blur-2xl p-6 md:p-12 pt-28"
        >
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Поиск по каталогу</h2>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all flex items-center gap-2 font-bold text-xs uppercase text-white/40">
                Закрыть <X size={20} />
              </button>
            </div>

            <div className="relative mb-12">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#a855f7]" size={28} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Название игры..."
                className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-6 pl-16 pr-6 text-2xl text-white outline-none focus:border-[#a855f7]/50 transition-all shadow-2xl"
              />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <AnimatePresence mode="popLayout">
                  {displayGames.map((game) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={game.id}
                      className="group relative aspect-[3/4] bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-[#a855f7]/50 transition-all"
                    >
                      <Image src={game.image} alt={game.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black p-4 flex flex-col justify-end">
                        <h4 className="font-black uppercase italic text-xs mb-2 leading-tight">{game.title}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-[#a855f7] font-black text-sm">{game.price} ₽</span>
                          <button 
                            onClick={() => { addItem(game); onClose(); }}
                            className="w-8 h-8 bg-[#a855f7] rounded-lg flex items-center justify-center text-white"
                          >
                            <ShoppingCart size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}