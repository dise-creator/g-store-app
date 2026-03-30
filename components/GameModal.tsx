"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingCart, Check, Play, MapPin, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import { useCartStore } from "@/store/useCart"; 
import type { Game } from "@/store/games";

// Безопасная загрузка плеера без ошибок в терминале
const ReactPlayer = dynamic(() => import("react-player").then((mod) => mod.default), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/50 animate-pulse flex items-center justify-center text-white/10 font-michroma text-[10px]">INITIALIZING...</div>
}) as any;

export default function GameModal({ game, isOpen, onClose }: { game: Game | null, isOpen: boolean, onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const VIDEO_URL = "https://www.youtube.com/watch?v=asRFwinrkeQ";

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown, true);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen, handleKeyDown]);

  if (!mounted || !isOpen || !game) return null;

  const handleAddToCart = () => {
    addItem(game); 
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />

      {/* ГЛАВНЫЙ КОНТЕЙНЕР УВЕЛИЧЕННОГО РАЗМЕРА */}
      <div className="relative z-[1000] w-full max-w-7xl bg-[#0a0b0d] border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-500">
        
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white/30 hover:text-white transition-all z-50">
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row min-h-[680px]">
          
          {/* СЕКЦИЯ ВИДЕО (ЛЕВО) */}
          <div className="relative w-full lg:w-[65%] bg-black min-h-[450px] flex items-center justify-center">
            <ReactPlayer
              url={VIDEO_URL}
              width="100%"
              height="100%"
              controls={true}
              playing={false}
              config={{
                youtube: {
                  playerVars: { rel: 0, modestbranding: 1 }
                }
              }}
            />
            {/* Градиент к инфо-панели */}
            <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#0a0b0d] pointer-events-none" />
          </div>

          {/* КОНТЕНТ (ПРАВО) */}
          <div className="w-full lg:w-[35%] p-10 lg:p-16 flex flex-col justify-between bg-[#0a0b0d]">
            <div className="space-y-10 text-left">
              
              {/* НАЗВАНИЕ: ДВУХЦВЕТНОЕ И КОМПАКТНОЕ */}
              <div className="space-y-3">
                <div className="h-1 w-16 bg-[#63f3f7] shadow-[0_0_15px_#63f3f7]" />
                <h2 className="text-5xl font-michroma font-black uppercase italic tracking-tighter skew-x-[-8deg] leading-[0.85]">
                  <span className="text-white">КИБЕРПАНК</span><br />
                  <span className="text-[#63f3f7]">2077</span>
                </h2>
              </div>

              {/* ПОЛНОЕ ОПИСАНИЕ: РАСШИРЕННЫЙ ЛОР */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-white/30 text-[10px] font-michroma font-bold uppercase tracking-widest">
                  <Zap size={12} className="text-[#63f3f7]" />
                  <span>О проекте</span>
                </div>
                <p className="text-white/40 text-sm leading-relaxed font-light font-michroma tracking-wide text-justify">
                  Добро пожаловать в Найт-Сити — мегаполис, где власть, роскошь и модификации тела ценятся выше всего. Вы играете за V, наёмника в поисках уникального устройства, позволяющего обрести бессмертие. 
                  Меняйте киберимпланты, выбирайте свой стиль игры и исследуйте огромный мир будущего, где каждое ваше решение меняет сюжет и окружающую действительность. Станьте легендой Найт-Сити, или погибните, пытаясь это сделать.
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-10">
              <div className="flex flex-col">
                <span className="text-white/20 text-[10px] uppercase font-michroma tracking-[0.4em] mb-2 italic">ULTIMATE EDITION</span>
                <span className="text-5xl lg:text-6xl font-michroma font-black text-white italic tracking-tighter">
                  {game.price}<span className="text-[#63f3f7] ml-2">₽</span>
                </span>
              </div>

              {/* КНОПКА «УМНОЕ СТЕКЛО» С БЛИКОМ */}
              <button 
                onClick={handleAddToCart}
                className={`group relative w-full h-20 rounded-[2rem] font-michroma font-black uppercase text-sm tracking-[0.25em] transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden border
                  ${isAdded 
                    ? "bg-[#63f3f7] text-black border-[#63f3f7] shadow-[0_0_50px_rgba(99,243,247,0.3)]" 
                    : "bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] active:scale-95"
                  }`}
              >
                {isAdded ? (
                  <><Check size={26} strokeWidth={3} className="animate-in zoom-in" /><span>В КОРЗИНЕ</span></>
                ) : (
                  <><ShoppingCart size={24} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" /><span>Добавить</span></>
                )}
                {/* Анимация блика внутри стекла */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}