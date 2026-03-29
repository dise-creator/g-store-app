"use client";

import React, { useCallback, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
// ИСПРАВЛЕНО: Правильный пакет lucide-react
import { ChevronLeft, ChevronRight } from "lucide-react"; 

// ИСПРАВЛЕНО: Импортируем сам компонент и ТИП отдельно
import GameCard from "./GameCard"; 
import type { Game } from "@/store/games"; // Берем интерфейс из стора, чтобы не было конфликтов

import GameCardSkeleton from "./GameCardSkeleton";
import GameModal from "./GameModal";

interface GameSliderProps {
  games: Game[];
  title: string;
  isLoading?: boolean;
}

export default function GameSlider({ games = [], title, isLoading = false }: GameSliderProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  const displayGames = useMemo(() => {
    return games.length > 0 && games.length < 12 ? [...games, ...games] : games;
  }, [games]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    containScroll: "trimSnaps",
    dragFree: true,
    loop: false, 
    duration: 35 
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="w-full py-4">
      {/* Компактная шапка */}
      <div className="flex items-center justify-between mb-6 px-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-[#00FFFF] rounded-full shadow-[0_0_15px_rgba(0,255,255,0.7)]" />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
            {title}
          </h2>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={scrollPrev} 
            className="w-10 h-10 rounded-xl bg-[#00FFFF] flex items-center justify-center text-black shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
          <button 
            onClick={scrollNext} 
            className="w-10 h-10 rounded-xl bg-[#00FFFF] flex items-center justify-center text-black shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight size={22} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Слайдер с 6 карточками в ряд */}
      <div className="overflow-hidden no-scrollbar px-6" ref={emblaRef}>
        <div className="flex gap-6"> 
          {isLoading 
            ? Array(6).fill(0).map((_, i) => (
                <div key={`skeleton-${i}`} className="flex-[0_0_calc((100%-120px)/6)]">
                  <GameCardSkeleton />
                </div>
              ))
            : displayGames.map((game, index) => (
                <div 
                  key={`${game.id}-${index}`} 
                  onClick={() => setSelectedGame(game)}
                  className="flex-[0_0_calc((100%-120px)/6)] min-w-0 select-none cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
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