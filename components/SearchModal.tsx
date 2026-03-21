"use client";

import React, { useEffect, useRef } from "react";
import { Search, X, Gamepad2 } from "lucide-react";
import { useCartStore } from "../store/useCart";

const ALL_GAMES = [
  { id: 1, title: "Starfield", price: 4200, image: "/images/starfield.jpg" },
  { id: 2, title: "Cyberpunk 2077", price: 2500, image: "/images/cyber.jpg" },
  { id: 3, title: "Elden Ring", price: 3900, image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, image: "/images/gta.jpg" },
  { id: 5, title: "FIFA 24", price: 2499, image: "/images/fifa2024.jpg" }, // Путь под твой файл
  { id: 6, title: "Minecraft", price: 1100, image: "/images/mc.jpg" },     // Путь под твой файл
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { searchQuery, setSearchQuery } = useCartStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const results = ALL_GAMES.filter((game) =>
    searchQuery && game.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-[#0a0a0b]/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#161920] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="relative flex items-center mb-2">
            <Search className="absolute left-4 w-5 h-5 text-[#a855f7]" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Какую игру ищем?"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-lg text-white focus:outline-none focus:border-[#a855f7]/50 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 p-1 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black ml-2 mb-3">Результаты поиска</p>
              
              {results.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {results.map((game) => (
                    <div 
                      key={game.id}
                      onClick={onClose}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-[#a855f7]/30 cursor-pointer transition-all group"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-white/10">
                         <img src={game.image} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold group-hover:text-[#a855f7] transition-colors">{game.title}</h4>
                        <p className="text-[#a855f7] font-black text-sm">{game.price.toLocaleString()} ₽</p>
                      </div>
                      <Gamepad2 className="w-5 h-5 text-white/10 group-hover:text-[#a855f7] transition-colors mr-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-white/20 italic">Ничего не найдено...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}