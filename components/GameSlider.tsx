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
  onSelectGame?: (game: Game) => void;
}

export default function GameSlider({
  games = [],
  title,
  isLoading = false,
  onSelectGame,
}: GameSliderProps) {
  // НЕ дублируем массив на мобиле
  const displayGames = useMemo(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return games;
    }

    return games.length > 0 && games.length < 8 ? [...games, ...games] : games;
  }, [games]);

  // ОПТИМИЗИРОВАННЫЙ EMBLA
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",

    // КРИТИЧНО ДЛЯ FPS
    dragFree: false,

    // Safari лагает с loop/free drag
    loop: false,

    duration: 28,
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <div
      className="
        w-full 
        py-6 md:py-8
        relative 
        rounded-[2rem] md:rounded-[2.5rem]
        overflow-hidden
        transform-gpu
      "
      style={{
        background: "#08113d",
        border: "1px solid rgba(255, 107, 0, 0.20)",

        // УПРОЩЕННАЯ ТЕНЬ
        boxShadow: "inset 0 0 30px rgba(0,20,80,0.18)",
      }}
    >
      {/* УБРАЛИ blur на мобиле */}
      {/* <div className="hidden md:block absolute top-0 right-1/4 w-80 h-40 bg-[#1d3393]/10 blur-[80px] rounded-full pointer-events-none" /> */}

      {/* HEADER */}
      <div className="relative flex items-center justify-between mb-5 px-4 md:px-8">
        <div className="flex items-center gap-3">
          {/* УПРОЩЕННЫЙ GLOW */}
          <div className="w-1 h-7 bg-[#ff6b00] rounded-full md:shadow-[0_0_15px_#ff6b00]" />

          <h2
            className="
              text-lg
              sm:text-xl
              md:text-3xl
              font-michroma
              text-white
              uppercase
              tracking-[0.08em]
              md:tracking-[0.15em]
              leading-none
              font-black
            "
          >
            {title}
          </h2>
        </div>

        {/* КНОПКИ */}
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="
              w-9 h-9 md:w-10 md:h-10
              rounded-xl
              bg-[#0a1860]/60
              border border-[#ff6b00]/30
              flex items-center justify-center
              text-white/50
              active:scale-90
              transition-transform
            "
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={scrollNext}
            className="
              w-9 h-9 md:w-10 md:h-10
              rounded-xl
              bg-[#0a1860]/60
              border border-[#ff6b00]/30
              flex items-center justify-center
              text-white/50
              active:scale-90
              transition-transform
            "
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* SLIDER */}
      <div className="relative">
        <div
          ref={emblaRef}
          className="
            overflow-hidden
            px-4 md:px-8
            cursor-grab
            active:cursor-grabbing
          "
        >
          <div className="flex gap-3 md:gap-4">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="
                        flex-[0_0_48%]
                        sm:flex-[0_0_30%]
                        md:flex-[0_0_22%]
                        lg:flex-[0_0_16.6%]
                      "
                    >
                      <GameCardSkeleton />
                    </div>
                  ))
              : displayGames.map((game, index) => (
                  <div
                    key={`${game.id}-${index}`}
                    className="
                      flex-[0_0_48%]
                      sm:flex-[0_0_30%]
                      md:flex-[0_0_22%]
                      lg:flex-[0_0_16.6%]
                      min-w-0
                      select-none
                      transform-gpu
                      
                    "
                  >
                    <GameCard
                      game={game}
                      onSelect={
                        onSelectGame ? () => onSelectGame(game) : undefined
                      }
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
