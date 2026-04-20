"use client";

import React, { useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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
  onSelectGame 
}: GameSliderProps) {

  const displayGames = useMemo(() => {
    return games.length > 0 && games.length < 8 ? [...games, ...games] : games;
  }, [games]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    containScroll: "trimSnaps",
    dragFree: true,
    loop: false, 
    duration: 40
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div
      className="w-full py-8 transform-gpu relative rounded-[2.5rem] overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(29,51,147,0.25) 0%, rgba(20,38,120,0.18) 50%, rgba(29,51,147,0.12) 100%)",
        border: "1px solid rgba(29,51,147,0.4)",
        boxShadow: "inset 0 0 60px rgba(29,51,147,0.1)",
      }}
    >
      {/* Декоративное пятно */}
      <div className="absolute top-0 right-1/4 w-80 h-40 bg-[#1d3393]/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Шапка */}
      <div className="relative flex items-center justify-between mb-6 px-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-[#63f3f7] rounded-full shadow-[0_0_15px_#63f3f7]" />
          <h2
            className="text-2xl md:text-3xl font-michroma text-white uppercase tracking-[0.15em] leading-none italic font-black"
            style={{ WebkitTextStroke: "0.5px rgba(255,255,255,0.3)" }}
          >
            {title}
          </h2>
        </div>

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
          <div className="flex gap-4">
            {isLoading 
              ? Array(8).fill(0).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    className="flex-[0_0_65%] sm:flex-[0_0_30%] md:flex-[0_0_22%] lg:flex-[0_0_16.6%]"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 22,
                      delay: i * 0.06,
                    }}
                  >
                    <GameCardSkeleton />
                  </motion.div>
                ))
              : displayGames.map((game, index) => (
                  <motion.div 
                    key={`${game.id}-${index}`} 
                    className="flex-[0_0_65%] sm:flex-[0_0_30%] md:flex-[0_0_22%] lg:flex-[0_0_16.6%] min-w-0 select-none"
                    initial={{ opacity: 0, scale: 0.7, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 22,
                      delay: (index % 8) * 0.06,
                    }}
                  >
                    <GameCard game={game} onSelect={() => onSelectGame?.(game)} />
                  </motion.div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}