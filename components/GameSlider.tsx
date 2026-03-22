"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";

interface Game {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface GameSliderProps {
  games: Game[];
  title: string;
  isLoading?: boolean; // Новый проп для управления загрузкой
}

export default function GameSlider({ games, title, isLoading = false }: GameSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    containScroll: "trimSnaps",
    dragFree: true,
    watchDrag: true
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="w-full">
      {/* Шапка секции: Заголовок и Кнопки */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-1 h-6 bg-[#a855f7] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
            {title}
          </h2>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={scrollPrev} 
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-[#a855f7] hover:border-[#a855f7] transition-all active:scale-90"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={scrollNext} 
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-[#a855f7] hover:border-[#a855f7] transition-all active:scale-90"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Контейнер слайдера */}
      <div className="overflow-hidden no-scrollbar" ref={emblaRef}>
        <div className="flex gap-4 cursor-grab active:cursor-grabbing">
          {isLoading 
            ? // 1. Состояние загрузки: показываем 6 скелетонов
              Array(6).fill(0).map((_, i) => (
                <div 
                  key={`skeleton-${i}`} 
                  className="flex-[0_0_calc((100%-16px)/2.2)] md:flex-[0_0_calc((100%-80px)/6)]"
                >
                  <GameCardSkeleton />
                </div>
              ))
            : // 2. Состояние данных: показываем реальные карточки
              games.map((game) => (
                <div 
                  key={game.id} 
                  /* Математика для 6 карточек:
                     100% ширины минус 5 отступов по 16px (gap-4), деленное на 6.
                  */
                  className="flex-[0_0_calc((100%-16px)/2.2)] md:flex-[0_0_calc((100%-80px)/6)] select-none"
                >
                  <GameCard {...game} />
                </div>
              ))
          }
          {/* Технический отступ в конце ленты */}
          <div className="flex-[0_0_1px] shrink-0 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}