"use client";

import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react"; 
import { Game } from "@/store/games";
import { useWishlistStore } from "@/store/useWishlist";
import { useGameModal } from "@/store/useGameModal";

// ИСПРАВЛЕНО: Добавлен интерфейс для поддержки onSelect
interface GameCardProps {
  game: Game;
  onSelect?: (game: Game) => void;
}

export default function GameCard({ game, onSelect }: GameCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const openModal = useGameModal((state) => state.openModal);
  
  // Проверка избранного
  const isFavorite = isInWishlist ? isInWishlist(game.id) : false;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(game);
  };

  const handleCardClick = () => {
    // Вызываем внешний обработчик, если он передан
    if (onSelect) {
      onSelect(game);
    }
    // Открываем модалку через стор
    openModal(game);
  };

  return (
    <div 
      onClick={handleCardClick} 
      // Дизайн стал плотнее (gap-3)
      className="group relative flex flex-col gap-3 cursor-pointer pointer-events-auto transition-all"
    >
      {/* Кнопка сердца (Компактная и закругленная) */}
      <button 
        onClick={handleHeartClick}
        className="absolute top-3 right-3 z-[60] w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white/40 hover:text-[#63f3f7] hover:border-[#63f3f7]/30 transition-all active:scale-90"
      >
        <Heart 
          size={16} 
          className={`transition-all duration-300 ${
            isFavorite ? "fill-[#63f3f7] text-[#63f3f7] drop-shadow-[0_0_5px_#63f3f7]" : ""
          }`} 
        />
      </button>

      {/* Изображение с сильным скруглением */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-white/5 transition-all duration-500 group-hover:border-[#63f3f7]/30 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <Image
          src={game.image}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized 
        />
        {/* Мягкий градиент при наведении */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Инфо блок (Компактный текст) */}
      <div className="flex flex-col gap-1 px-2">
        <h3 className="font-michroma text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-white/30 group-hover:text-white/80 transition-all duration-300 italic truncate">
          {game.title}
        </h3>
        <div className="flex items-center gap-1.5">
          {/* Цена стала аккуратнее (text-lg) */}
          <span className="font-michroma text-lg text-white leading-none" suppressHydrationWarning>
            {game.price.toLocaleString()}
          </span>
          <span className="font-michroma text-[10px] text-[#63f3f7] mt-1">₽</span>
        </div>
      </div>
    </div>
  );
}