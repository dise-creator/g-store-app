"use client";

import React, { useCallback, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GameCard, { Game } from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import GameModal from "./GameModal";

interface GameSliderProps {
  games: Game[];
  title: string;
  isLoading?: boolean;
}

export default function GameSlider({ games = [], title, isLoading = false }: GameSliderProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  // Удваиваем массив для длины ленты
  const displayGames = useMemo(() => {
    return games.length > 0 && games.length < 10 ? [...games, ...games] : games;
  }, [games]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    containScroll: "trimSnaps",
    dragFree: true,
    loop: false, // ВЫКЛЮЧАЕМ loop для возврата эффекта пружины
    duration: 30 // Делаем анимацию более мягкой и "резиновой"
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-[#00FFFF] rounded-full shadow-[0_0_15px_rgba(0,255,255,0.7)]" />
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">{title}</h2>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={scrollPrev} 
            className="w-10 h-10 rounded-xl bg-[#00FFFF] flex items-center justify-center text-black shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:scale-105 active:scale-90 transition-all"
          >
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
          <button 
            onClick={scrollNext} 
            className="w-10 h-10 rounded-xl bg-[#00FFFF] flex items-center justify-center text-black shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:scale-105 active:scale-90 transition-all"
          >
            <ChevronRight size={22} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden no-scrollbar px-4" ref={emblaRef}>
        <div className="flex gap-4">
          {isLoading 
            ? Array(6).fill(0).map((_, i) => (
                <div key={`skeleton-${i}`} className="flex-[0_0_calc((100%-24px)/2.2)] md:flex-[0_0_calc((100%-80px)/6)]">
                  <GameCardSkeleton />
                </div>
              ))
            : displayGames.map((game, index) => (
                <div 
                  key={`${game.id}-${index}`} 
                  onClick={() => setSelectedGame(game)}
                  // Адаптив: 2.2 карточки на мобилках, 6 на десктопе
                  className="flex-[0_0_calc((100%-24px)/2.2)] md:flex-[0_0_calc((100%-80px)/6)] min-w-0 select-none cursor-pointer"
                >
                  <GameCard game={game} />
                </div>
              ))
          }
        </div>
      </div>

      <GameModal 
        game={selectedGame} 
        isOpen={!!selectedGame} 
        onClose={() => setSelectedGame(null)} 
      />
    </div>
  );
}