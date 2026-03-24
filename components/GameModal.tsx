"use client";

import React, { useEffect } from "react";
import { X, ShoppingCart, Star } from "lucide-react";
import { Game } from "./GameCard";

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GameModal({ game, isOpen, onClose }: GameModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !game) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-[3rem] overflow-hidden flex flex-col md:row shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
        
        {/* КНОПКА ЗАКРЫТИЯ: Теперь бирюзовая */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-20 p-3 bg-[#00FFFF] rounded-full text-black shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:scale-110 active:scale-90 transition-all"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="flex flex-col md:flex-row w-full h-full">
          {/* ИЗОБРАЖЕНИЕ: Исправлено отображение */}
          <div className="w-full md:w-1/2 min-h-[400px] relative">
            <img 
              src={game.image || `/images/games/${game.id}.jpg`} 
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0a]/40" />
          </div>

          {/* КОНТЕНТ */}
          <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-1.5 bg-[#00FFFF]/10 text-[#00FFFF] text-[10px] font-black uppercase rounded-lg border border-[#00FFFF]/20">
                Популярное
              </span>
              <div className="flex items-center gap-1.5 text-[#FFD700]">
                <Star size={18} fill="currentColor" />
                <span className="text-sm font-black italic">4.9</span>
              </div>
            </div>

            <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none">
              {game.title}
            </h2>

            <p className="text-white/40 text-lg leading-relaxed mb-10 font-medium">
              Погрузитесь в невероятное приключение. Лучшая графика и полная свобода действий ждут вас в Digital Universe.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="space-y-2">
                <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Жанр</p>
                <p className="text-base text-white/80 font-bold uppercase italic">Action / RPG</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Платформа</p>
                <p className="text-base text-white/80 font-bold uppercase italic">PC / PS5</p>
              </div>
            </div>

            <div className="flex items-end justify-between mt-auto pt-8 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Цена издания</p>
                <p className="text-4xl font-black text-white italic tracking-tighter">
                  {game.price} ₽
                </p>
              </div>

              {/* КНОПКА КУПИТЬ: Теперь тоже бирюзовая в тон */}
              <button className="flex items-center gap-4 px-10 py-5 bg-[#00FFFF] rounded-[1.5rem] text-black font-black shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_50px_rgba(0,255,255,0.5)] hover:scale-105 active:scale-95 transition-all uppercase italic text-lg">
                <ShoppingCart size={24} strokeWidth={3} />
                Купить
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Подсказка ESC */}
      <div className="fixed bottom-12 text-[11px] font-black text-white/10 uppercase tracking-[0.3em] animate-pulse">
        Нажмите <span className="mx-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-white/30">ESC</span> чтобы закрыть
      </div>
    </div>
  );
}