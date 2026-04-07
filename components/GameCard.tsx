"use client";

import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react"; 
import { Game } from "@/store/games";
import { useWishlistStore } from "@/store/useWishlist";
import { useGameModal } from "@/store/useGameModal";

interface GameCardProps {
  game: Game;
  onSelect?: (game: Game) => void;
}

export default function GameCard({ game, onSelect }: GameCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const openModal = useGameModal((state) => state.openModal);
  
  const isFavorite = isInWishlist ? isInWishlist(game.id) : false;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Важно: чтобы клик по сердцу не открывал модалку
    toggleItem(game);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Клик зафиксирован:", game.title);
    if (onSelect) onSelect(game);
    openModal(game);
  };

  return (
    <div className="group relative flex flex-col gap-3 transition-all">
      
      {/* 1. КНОПКА ИЗБРАННОГО 
          Оставляем её вне основной зоны клика через высокий z-index 
      */}
      <button 
        onClick={handleHeartClick}
        type="button"
        className="absolute top-3 right-3 z-[60] w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white/40 hover:text-[#63f3f7] transition-all active:scale-90"
      >
        <Heart size={16} className={isFavorite ? "fill-[#63f3f7] text-[#63f3f7] drop-shadow-[0_0_5px_#63f3f7]" : ""} />
      </button>

      {/* 2. ИНТЕРАКТИВНАЯ ОБЕРТКА 
          Используем кнопку на всю площадь карточки. Это гарантирует обработку клика браузером.
      */}
      <button
        onClick={handleCardClick}
        type="button"
        className="absolute inset-0 z-50 w-full h-full cursor-pointer appearance-none bg-transparent border-none p-0"
        aria-label={`Открыть ${game.title}`}
      />

      {/* 3. ВИЗУАЛЬНАЯ ЧАСТЬ (Оформление) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-white/5 transition-all group-hover:border-[#63f3f7]/30 bg-[#161618]">
        <Image 
          src={game.image} 
          alt={game.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
          unoptimized 
        />
        {/* pointer-events-none здесь обязателен */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* 4. ТЕКСТОВАЯ ЧАСТЬ */}
      <div className="flex flex-col gap-1 px-2 pointer-events-none">
        <h3 className="font-michroma text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-white/30 group-hover:text-white/80 italic truncate">
          {game.title}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="font-michroma text-lg text-white leading-none">
            {game.price.toLocaleString()}
          </span>
          <span className="font-michroma text-[10px] text-[#63f3f7] mt-1">₽</span>
        </div>
      </div>
    </div>
  );
}