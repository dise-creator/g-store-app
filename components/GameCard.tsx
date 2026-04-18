"use client";

import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react"; 
import { Game, getActiveDiscount, getDiscountedPrice } from "@/store/games";
import { useWishlistStore } from "@/store/useWishlist";
import { useGameModal } from "@/store/useGameModal";
import { useRegionStore, REGIONS } from "@/store/useRegion";

interface GameCardProps {
  game: Game;
  onSelect?: (game: Game) => void;
}

export default function GameCard({ game, onSelect }: GameCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const openModal = useGameModal((state) => state.openModal);
  const { region, getPrice } = useRegionStore();
  
  const isFavorite = isInWishlist ? isInWishlist(game.id) : false;

  // Скидка
  const discount = getActiveDiscount(game);
  const hasDiscount = discount > 0;
  const basePrice = hasDiscount ? getDiscountedPrice(game) : game.price;

  // Цена всегда региональная — RU больше нет
  const displayPrice = getPrice(basePrice);
  const originalDisplayPrice = getPrice(game.price);
  const currentRegion = REGIONS[region];

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(game);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelect) onSelect(game);
    openModal(game);
  };

  return (
    <div className="group relative flex flex-col gap-3 transition-all">
      
      {/* Кнопка вишлист */}
      <button 
        onClick={handleHeartClick}
        type="button"
        className="absolute top-3 right-3 z-[60] w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white/40 hover:text-[#63f3f7] transition-all active:scale-90"
      >
        <Heart size={16} className={isFavorite ? "fill-[#63f3f7] text-[#63f3f7] drop-shadow-[0_0_5px_#63f3f7]" : ""} />
      </button>

      {/* Бейдж скидки — левый верхний угол */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-[60] flex items-center gap-1 px-2.5 py-1.5 bg-red-500 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          <span className="text-white font-black text-xs uppercase tracking-wider">
            -{discount}%
          </span>
        </div>
      )}

      {/* Флаг региона — всегда показываем */}
      <div className={`absolute z-[60] flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 ${
        hasDiscount ? "top-12 left-3" : "top-3 left-3"
      }`}>
        <span className="text-xs">{currentRegion.flag}</span>
        <span className="text-[8px] text-white/50 font-black uppercase">{currentRegion.code}</span>
      </div>

      {/* Кнопка клика на всю карточку */}
      <button
        onClick={handleCardClick}
        type="button"
        className="absolute inset-0 z-50 w-full h-full cursor-pointer appearance-none bg-transparent border-none p-0"
        aria-label={`Открыть ${game.title}`}
      />

      {/* Изображение */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-white/5 transition-all group-hover:border-[#63f3f7]/30 bg-[#161618]">
        <Image 
          src={game.image} 
          alt={game.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
          unoptimized 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {hasDiscount && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <p className="text-[9px] text-red-300 font-black uppercase tracking-widest text-center">
              🔥 Скидка до {new Date(game.discount_until!).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
            </p>
          </div>
        )}
      </div>

      {/* Текст */}
      <div className="flex flex-col gap-1 px-2 pointer-events-none">
        <h3 className="font-michroma text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-white/30 group-hover:text-white/80 italic truncate">
          {game.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Актуальная цена */}
          <div className="flex items-center gap-1.5">
            <span className={`font-michroma text-lg leading-none ${hasDiscount ? "text-red-400" : "text-white"}`}>
              {displayPrice.toLocaleString()}
            </span>
            <span className={`font-michroma text-[10px] mt-1 ${hasDiscount ? "text-red-400" : "text-[#63f3f7]"}`}>₽</span>
          </div>

          {/* Зачёркнутая оригинальная цена — всегда показываем */}
          <span className="font-michroma text-xs text-white/20 line-through leading-none mt-1">
            {hasDiscount ? originalDisplayPrice.toLocaleString() : game.price.toLocaleString()} ₽
          </span>
        </div>
      </div>
    </div>
  );
}