"use client";

import React, { useCallback, useState } from "react";
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
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    containScroll: "trimSnaps",
    dragFree: true
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-[#a855f7] rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{title}</h2>
        </div>

        <div className="flex gap-2">
          <button onClick={scrollPrev} className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-[#a855f7] transition-all active:scale-90">
            <ChevronLeft size={20} />
          </button>
          <button onClick={scrollNext} className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-[#a855f7] transition-all active:scale-90">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden no-scrollbar" ref={emblaRef}>
        <div className="flex gap-5 px-2">
          {isLoading 
            ? Array(6).fill(0).map((_, i) => (
                <div key={`skeleton-${i}`} className="flex-[0_0_calc((100%-16px)/2.2)] md:flex-[0_0_calc((100%-100px)/6)]">
                  <GameCardSkeleton />
                </div>
              ))
            : (games || []).map((game, index) => (
                <div 
                  key={`${game.id}-${index}`} 
                  onClick={() => setSelectedGame(game)}
                  className="flex-[0_0_calc((100%-16px)/2.2)] md:flex-[0_0_calc((100%-100px)/6)] select-none"
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