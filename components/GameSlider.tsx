"use client";

import React, { useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 

import GameCard from "./GameCard"; 
import type { Game } from "@/store/games"; 
import GameCardSkeleton from "./GameCardSkeleton";

interface GameSliderProps {
  games: Game[];
  title: string;
  isLoading?: boolean;
}

export default function GameSlider({ games = [], title, isLoading = false }: GameSliderProps) {
  // УДАЛИЛИ локальный стейт selectedGame и GameModal отсюда, 
  // так как модалка теперь глобальная в page.tsx

  const displayGames = useMemo(() => {
    // Если игр мало, дублируем их для плавности прокрутки
    return games.length > 0 && games.length < 8 ? [...games, ...games] : games;
  }, [games]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    containScroll: "trimSnaps",
    dragFree: true,
    loop: false, 
    duration: 40 
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="w-full py-10 transform-gpu">
      {/* Шапка слайдера */}
      <div className="flex items-center justify-between mb-8 px-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-[#63f3f7] rounded-full shadow-[0_0_20px_#63f3f7]" />
          <h2 className="text-xl md:text-2xl font-michroma text-white uppercase tracking-[0.25em] leading-none opacity-90 italic">
            {title}
          </h2>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={scrollPrev} 
            className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:text-[#63f3f7] hover:border-[#63f3f7]/50 hover:bg-[#63f3f7]/5 transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={scrollNext} 
            className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:text-[#63f3f7] hover:border-[#63f3f7]/50 hover:bg-[#63f3f7]/5 transition-all active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Слайдер */}
      <div className="relative">
        <div 
          className="overflow-hidden px-8 cursor-grab active:cursor-grabbing 
                     [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]" 
          ref={emblaRef}
        >
          <div className="flex gap-6 md:gap-8"> 
            {isLoading 
              ? Array(6).fill(0).map((_, i) => (
                  <div key={`skeleton-${i}`} className="flex-[0_0_75%] sm:flex-[0_0_35%] md:flex-[0_0_25%] lg:flex-[0_0_20%]">
                    <GameCardSkeleton />
                  </div>
                ))
              : displayGames.map((game, index) => (
                  <div 
                    key={`${game.id}-${index}`} 
                    className="flex-[0_0_75%] sm:flex-[0_0_35%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 select-none"
                  >
                    {/* GameCard сам внутри себя умеет открывать глобальную модалку */}
                    <GameCard game={game} />
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}