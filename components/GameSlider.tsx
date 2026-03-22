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
  // containScroll: "trimSnaps" помогает не обрезать последнюю карточку
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    containScroll: "trimSnaps",
    dragFree: true 
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-[#a855f7] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            {title}
          </h2>
        </div>

        <div className="flex gap-2">
          <button onClick={scrollPrev} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={scrollNext} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      // Внутри компонента GameSlider.tsx
<div className="overflow-hidden no-scrollbar cursor-grab active:cursor-grabbing" ref={emblaRef}>
  {/* Добавляем -mx-4 и px-4 (или больше), чтобы расширить зону свайпа */}
  <div className="flex gap-6 -mx-4 px-4 md:-mx-8 md:px-8 pb-4">
    {games.map((game) => (
      <div 
        key={game.id} 
        className="flex-[0_0_280px] md:flex-[0_0_320px] select-none"
      >
        <GameCard {...game} />
      </div>
    ))}
    {/* Пустой блок в конце для дополнительного отступа */}
    <div className="flex-[0_0_20px] md:flex-[0_0_40px] shrink-0" />
  </div>
</div>
    </div>
  );
}