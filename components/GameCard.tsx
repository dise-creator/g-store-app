"use client";

import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react"; // Импортируем сердце
import type { Game } from "@/store/games";
import { useWishlistStore } from "@/store/useWishlist"; // Импортируем стор

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isFavorite = isInWishlist(game.id);

  return (
    <div className="group relative flex flex-col gap-5 cursor-pointer">
      {/* Контейнер изображения */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] border border-white/5 transition-all duration-500 group-hover:border-[#63f3f7]/40 group-hover:shadow-[0_0_40px_rgba(99,243,247,0.15)]">
        
        {/* --- КНОПКА ИЗБРАННОГО --- */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Останавливаем всплытие, чтобы не открылась модалка
            toggleItem(game);
          }}
          className="absolute top-5 right-5 z-20 w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white/50 hover:text-[#63f3f7] hover:border-[#63f3f7]/50 transition-all duration-300 active:scale-90 group/heart"
        >
          <Heart 
            size={22} 
            className={`transition-all duration-300 ${
              isFavorite 
                ? "fill-[#63f3f7] text-[#63f3f7] drop-shadow-[0_0_8px_rgba(99,243,247,0.5)]" 
                : "group-hover/heart:scale-110"
            }`} 
          />
        </button>

        <Image
          src={game.image}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized // Для предотвращения 400 ошибки, если пути внешние
        />

        {/* Затемнение снизу для лучшей читаемости текста (опционально) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Инфо-блок */}
      <div className="flex flex-col gap-2 px-2">
        <h3 className="font-michroma text-[12px] md:text-[14px] uppercase tracking-[0.15em] text-white/40 group-hover:text-white/90 transition-all duration-300 line-clamp-1">
          {game.title}
        </h3>
        
        <div className="flex items-center gap-1.5">
          <span className="font-michroma text-xl md:text-2xl text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            {game.price.toLocaleString()}
          </span>
          <span className="font-michroma text-sm md:text-base text-[#63f3f7] drop-shadow-[0_0_8px_rgba(99,243,247,0.4)]">
            ₽
          </span>
        </div>
      </div>

      {/* Декоративная полоса */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-[#63f3f7] transition-all duration-500 group-hover:w-[70%] blur-[1.5px] opacity-0 group-hover:opacity-100 shadow-[0_0_15px_#63f3f7]" />
    </div>
  );
}