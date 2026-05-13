"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import {
  type Game,
  getActiveDiscount,
  getDiscountedPrice,
} from "@/store/games";
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
  const [imgError, setImgError] = useState(false);

  const isFavorite = isInWishlist(game.id);

  const discount = getActiveDiscount(game);
  const hasDiscount = discount > 0;
  const basePrice = hasDiscount ? getDiscountedPrice(game) : game.price;
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
    if (onSelect) {
      onSelect(game);
    } else {
      openModal(game);
    }
  };

  return (
    <div className="group relative flex flex-col gap-3">
      {/* Кнопка сердца */}
      <button
        onClick={handleHeartClick}
        type="button"
        className="absolute top-3 right-3 z-[70] w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white/40 hover:text-[#ff6b00] transition-colors active:scale-90"
      >
        <Heart
          size={16}
          className={
            isFavorite
              ? "fill-[#ff6b00] text-[#ff6b00] drop-shadow-[0_0_5px_#ff6b00]"
              : ""
          }
        />
      </button>

      {/* Скидка */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-[70] flex items-center gap-1 px-2.5 py-1.5 bg-red-500 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          <span className="text-white font-black text-xs uppercase tracking-wider">
            -{discount}%
          </span>
        </div>
      )}

      {/* Регион */}
      <div
        className={`absolute z-[70] flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 ${
          hasDiscount ? "top-12 left-3" : "top-3 left-3"
        }`}
      >
        <span className="text-xs">{currentRegion.flag}</span>
        <span className="text-[8px] text-white/50 font-black uppercase">
          {currentRegion.code}
        </span>
      </div>

      {/* Кнопка открытия модалки */}
      <button
        onClick={handleCardClick}
        type="button"
        className="absolute inset-0 z-[40] w-full h-full cursor-pointer appearance-none bg-transparent border-none p-0 outline-none focus:outline-none"
        aria-label={`Открыть ${game.title}`}
      />

      {/* Картинка */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#161618]">
        {!imgError ? (
          <Image
            src={game.image}
            alt={game.title}
            fill
            sizes="(max-width: 640px) 65vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 16vw"
            className="object-cover object-top"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#161618]">
            <span className="text-white/20 text-xs font-black uppercase">
              Нет фото
            </span>
          </div>
        )}
      </div>

      {/* Инфо */}
      <div className="flex flex-col gap-1 px-2">
        <h3 className="font-michroma text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-white/40 truncate">
          {game.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className={`font-michroma text-lg leading-none ${hasDiscount ? "text-red-400" : "text-white"}`}>
              {displayPrice.toLocaleString()}
            </span>
            <span className={`font-michroma text-[10px] mt-1 ${hasDiscount ? "text-red-400" : "text-[#ff6b00]"}`}>
              ₽
            </span>
          </div>
          <span className="font-michroma text-xs text-white/20 line-through leading-none mt-1">
            {hasDiscount ? originalDisplayPrice.toLocaleString() : game.price.toLocaleString()} ₽
          </span>
        </div>
      </div>
    </div>
  );
}