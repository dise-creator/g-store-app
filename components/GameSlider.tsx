"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "./GameCard";

interface Game {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function GameSlider({ games, title }: { games: Game[], title: string }) {
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
      {/* Шапка: выровнена по краям сетки */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-[#a855f7] rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)]" />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            {title}
          </h2>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={scrollPrev} 
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-[#a855f7] transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={scrollNext} 
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-[#a855f7] transition-all active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Вьюпорт свайпера */}
      <div className="overflow-hidden no-scrollbar" ref={emblaRef}>
        <div className="flex gap-5 cursor-grab active:cursor-grabbing">
          {games.map((game) => (
            <div 
              key={game.id} 
              /* Математика для 4-х целых карточек:
                100% ширины - 60px (3 промежутка по 20px) / 4 карточки.
                На мобилках: 1.2 карточки, чтобы был виден край следующей.
              */
              className="flex-[0_0_calc((100%-20px)/1.2)] md:flex-[0_0_calc((100%-60px)/4)] select-none"
            >
              <GameCard {...game} />
            </div>
          ))}
          {/* Небольшой отступ в конце для плавности */}
          <div className="flex-[0_0_20px] shrink-0 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}