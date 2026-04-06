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
  // ДОБАВИЛИ: Это исправит ошибку "onSelectGame не существует" в page.tsx
  onSelectGame?: (game: Game) => void;
}

export default function GameSlider({ 
  games = [], 
  title, 
  isLoading = false,
  onSelectGame 
}: GameSliderProps) {

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
    // УМЕНЬШИЛИ: py-10 -> py-6 для компактности
    <div className="w-full py-6 transform-gpu">
      {/* Шапка слайдера */}
      <div className="flex items-center justify-between mb-6 px-8">
        <div className="flex items-center gap-4">
          {/* Сделали полоску чуть короче: h-8 -> h-6 */}
          <div className="w-1 h-6 bg-[#63f3f7] rounded-full shadow-[0_0_15px_#63f3f7]" />
          <h2 className="text-lg md:text-xl font-michroma text-white uppercase tracking-[0.2em] leading-none opacity-80 italic">
            {title}
          </h2>
        </div>

        {/* Компактные кнопки управления */}
        <div className="flex gap-2">
          <button 
            onClick={scrollPrev} 
            className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:text-[#63f3f7] hover:border-[#63f3f7]/50 hover:bg-[#63f3f7]/5 transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={scrollNext} 
            className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:text-[#63f3f7] hover:border-[#63f3f7]/50 hover:bg-[#63f3f7]/5 transition-all active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Слайдер */}
      <div className="relative">
        <div 
          className="overflow-hidden px-8 cursor-grab active:cursor-grabbing 
                     [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]" 
          ref={emblaRef}
        >
          {/* ИСПРАВЛЕНО: Уменьшили gap-8 -> gap-4 для плотности карточек */}
          <div className="flex gap-4"> 
            {isLoading 
              ? Array(8).fill(0).map((_, i) => (
                  // УМЕНЬШИЛИ: flex-basis теперь позволяет вместить больше карточек (lg: 16.6% вместо 20%)
                  <div key={`skeleton-${i}`} className="flex-[0_0_65%] sm:flex-[0_0_30%] md:flex-[0_0_22%] lg:flex-[0_0_16.6%]">
                    <GameCardSkeleton />
                  </div>
                ))
              : displayGames.map((game, index) => (
                  <div 
                    key={`${game.id}-${index}`} 
                    className="flex-[0_0_65%] sm:flex-[0_0_30%] md:flex-[0_0_22%] lg:flex-[0_0_16.6%] min-w-0 select-none"
                  >
                    {/* Передаем функцию выбора, если она нужна */}
                    <GameCard game={game} onSelect={() => onSelectGame?.(game)} />
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}