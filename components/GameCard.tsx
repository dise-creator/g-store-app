"use client";

import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react"; 
import { Game } from "@/store/games";
import { useWishlistStore } from "@/store/useWishlist";
import { useGameModal } from "@/store/useGameModal"; // Импорт стора модалки

export default function GameCard({ game }: { game: Game }) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const openModal = useGameModal((state) => state.openModal);
  const isFavorite = isInWishlist(game.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(game);
  };

  return (
    <div 
      onClick={() => openModal(game)} // Открываем модалку при клике на всю карточку
      className="group relative flex flex-col gap-5 cursor-pointer pointer-events-auto"
    >
      {/* Кнопка сердца остается независимой */}
      <button 
        onClick={handleHeartClick}
        className="absolute top-5 right-5 z-[60] w-12 h-12 flex items-center justify-center bg-black/60 backdrop-blur-xl rounded-2xl border border-white/20 text-white/50 hover:text-[#63f3f7] transition-all active:scale-90"
      >
        <Heart 
          size={22} 
          className={`transition-all duration-300 ${
            isFavorite ? "fill-[#63f3f7] text-[#63f3f7] drop-shadow-[0_0_8px_#63f3f7]" : ""
          }`} 
        />
      </button>

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] border border-white/5 transition-all duration-500 group-hover:border-[#63f3f7]/40 group-hover:shadow-[0_0_40px_rgba(99,243,247,0.1)]">
        <Image
          src={game.image}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="flex flex-col gap-2 px-2">
        <h3 className="font-michroma text-[12px] md:text-[14px] uppercase tracking-[0.15em] text-white/40 group-hover:text-white/90 transition-all duration-300 italic">
          {game.title}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="font-michroma text-xl md:text-2xl text-white">
            {game.price.toLocaleString()}
          </span>
          <span className="font-michroma text-sm text-[#63f3f7]">₽</span>
        </div>
      </div>
    </div>
  );
}