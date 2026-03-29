"use client";

import React from "react";
import Image from "next/image";
import { Game } from "@/store/games"; // Импортируем интерфейс оттуда

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  if (!game) return null;

  return (
    <div className="w-full flex flex-col gap-3 group cursor-pointer">
      {/* Контейнер изображения с легким неоновым свечением при наведении */}
      <div className="relative aspect-[3/4.2] w-full rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#1a1a1e] transition-all duration-500 group-hover:border-[#00FFFF]/30 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.1)]">
        <Image 
          src={game.image} 
          alt={game.title} 
          fill 
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
          priority={game.id <= 6} // Приоритетная загрузка для первых карточек
        />
      </div>

      {/* Инфо-блок */}
      <div className="px-1 transition-transform duration-300 group-hover:translate-x-1">
        <h2 className="text-[13px] font-black uppercase italic tracking-tighter text-white/90 line-clamp-1 group-hover:text-[#00FFFF] transition-colors">
          {game.title}
        </h2>
        <div className="flex items-baseline gap-1 mt-1">
           <span className="text-base font-black italic text-white/80">
            {game.price.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold uppercase text-white/40">₽</span>
        </div>
      </div>
    </div>
  );
}