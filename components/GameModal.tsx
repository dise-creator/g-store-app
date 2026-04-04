"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import { useCartStore } from "@/store/useCart"; 
import type { Game } from "@/store/games";

// Безопасный импорт плеера
const ReactPlayer = dynamic(() => import("react-player"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/50 animate-pulse" />
}) as any;

export default function GameModal({ game, isOpen, onClose }: { game: Game | null, isOpen: boolean, onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Логика закрытия по Esc и управления скроллом
  useEffect(() => {
    setMounted(true);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !game) return null;

  const handleAddToCart = () => {
    addItem(game); 
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <div className="relative z-[1000] w-full max-w-6xl bg-[#0a0b0d] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* ВИДЕО */}
        <div className="w-full lg:w-[60%] bg-black aspect-video lg:aspect-auto">
          <ReactPlayer
            url={game.videoUrl || "https://www.youtube.com/watch?v=asRFwinrkeQ"}
            width="100%"
            height="100%"
            controls
          />
        </div>

        {/* ИНФО */}
        <div className="w-full lg:w-[40%] p-8 lg:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-4xl font-michroma font-black text-white uppercase italic">
              {game.title}
            </h2>
            
            <p className="text-white/40 text-sm font-michroma leading-relaxed">
              {game.description || "Описание скоро появится..."}
            </p>

            <div className="p-4 rounded-xl bg-[#63f3f7]/5 border border-[#63f3f7]/20">
              <div className="flex gap-3">
                <Zap size={16} className="text-[#63f3f7] shrink-0" />
                <p className="text-[10px] text-[#63f3f7] font-michroma uppercase tracking-wider leading-tight">
                  Цифровой ваучер: код пополнения придет на почту сразу после оплаты.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="text-5xl font-michroma font-black text-white italic">
              {game.price}<span className="text-[#63f3f7] ml-2">₽</span>
            </div>

            <button 
              onClick={handleAddToCart}
              className={`w-full h-16 rounded-2xl font-michroma font-black uppercase text-xs tracking-widest transition-all active:scale-95
                ${isAdded ? "bg-[#63f3f7] text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {isAdded ? "В КОРЗИНЕ" : "ДОБАВИТЬ"}
            </button>
          </div>
        </div>

        {/* Кнопка закрытия (крестик) */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <X size={24} />
        </button>
      </div>
    </div>,
    document.body
  );
}