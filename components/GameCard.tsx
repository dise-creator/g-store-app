"use client";

import React from "react";
import Image from "next/image";

export interface Game {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  if (!game) return null;

  return (
    <div className="w-full flex flex-col gap-3 group cursor-pointer">
      <div className="relative aspect-[3/4.2] w-full rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#1a1a1e]">
        <Image 
          src={game.image} 
          alt={game.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </div>
      <div className="px-1">
        <h2 className="text-[13px] font-black uppercase italic tracking-tighter text-white/90 line-clamp-1">
          {game.title}
        </h2>
        <p className="text-base font-black italic text-white/80 mt-1">
          {game.price.toLocaleString()} ₽
        </p>
      </div>
    </div>
  );
}