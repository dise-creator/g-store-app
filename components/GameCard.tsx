"use client";

import React from "react";
import Image from "next/image";

interface GameCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function GameCard({ title, price, image }: GameCardProps) {
  return (
    <div className="group cursor-pointer flex flex-col gap-3">
      {/* Изображение: теперь оно чистое, без текста поверх */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white/5 transition-all duration-300 group-hover:ring-2 group-hover:ring-[#a855f7]/50">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Инфо-блок под карточкой */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <span className="text-base font-bold text-white tracking-tight">
          {price.toLocaleString()} ₽
        </span>
        <h3 className="text-xs font-medium text-white/40 truncate uppercase tracking-wider">
          {title}
        </h3>
      </div>
    </div>
  );
}