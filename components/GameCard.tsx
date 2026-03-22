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
      className="group relative aspect-[3/4] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.05] active:scale-95 border border-white/10 shadow-2xl bg-[#1a1c23]"
    >
      {/* Фоновая картинка с эффектом при наведении */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2 brightness-[0.8] group-hover:brightness-100"
      />

      {/* Матовый градиент снизу */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-black/20 to-transparent opacity-90" />

      {/* Контент */}
      <div className="absolute inset-0 flex flex-col items-center justify-end p-5 text-center pb-10">
        
        {/* Название: Используем встроенный мощный шрифт с жирным начертанием */}
        <h3 className="text-white text-[1.4rem] font-[1000] uppercase italic leading-[0.85] mb-4 
                       tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,1)]
                       transition-all duration-500 group-hover:text-[#a855f7] group-hover:scale-110">
          {title}
        </h3>

        {/* Цена в стильном "стеклянном" бабле */}
        <div className="bg-white/10 backdrop-blur-xl px-5 py-2 rounded-2xl border border-white/20 
                        shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
                        transition-all duration-500 group-hover:bg-[#a855f7] group-hover:border-transparent group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <div className="flex items-center gap-2 text-white font-black text-lg">
            <span>{price.toLocaleString()}</span>
            <span className="text-[12px] text-[#a855f7] group-hover:text-white transition-colors font-extrabold">₽</span>
          </div>
        </div>
      </div>
      
      {/* Неоновая рамка при наведении */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                      ring-inset ring-2 ring-[#a855f7]/40 rounded-[32px]" />
    </div>
  );
}