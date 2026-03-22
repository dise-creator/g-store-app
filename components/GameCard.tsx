"use client";

import React from "react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";

interface GameCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function GameCard({ id, title, price, image }: GameCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div 
      onClick={() => addItem({ id, title, price, image })}
      className="group cursor-pointer flex flex-col gap-3 animate-fade-in transition-transform active:scale-95"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white/5 transition-all duration-300 group-hover:ring-2 group-hover:ring-[#a855f7]/50 shadow-2xl">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[#a855f7]/0 group-hover:bg-[#a855f7]/5 transition-colors duration-300" />
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <span className="text-base font-bold text-white tracking-tight">
          {price.toLocaleString()} ₽
        </span>
        <h3 className="text-[10px] md:text-xs font-medium text-white/40 truncate uppercase tracking-wider">
          {title}
        </h3>
      </div>
    </div>
  );
}