"use client";

import React from "react";
import { useCartStore } from "../store/useCart";
import { Plus } from "lucide-react";

interface GameCardProps {
  id: number;
  title: string;
  price: number;
  discount: string;
  image: string;
}

export default function GameCard({ id, title, price, discount, image }: GameCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="bg-[#1e2530] rounded-3xl border border-white/5 h-full flex flex-col group hover:border-[#a855f7]/50 transition-all duration-500 shadow-xl overflow-hidden relative min-h-[420px]">
      {/* Картинка-постер на всю высоту карточки */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Затемнение для читаемости текста (от середины к низу) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1217] via-[#0f1217]/60 to-transparent z-10" />
      </div>

      {/* Контент поверх картинки */}
      <div className="relative z-20 flex flex-col h-full p-5 justify-end">
        {/* Скидка сверху */}
        <div className="absolute top-4 right-4 bg-[#a855f7] text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-lg uppercase tracking-tight">
          {discount}
        </div>

        {/* Инфо внизу */}
        <div className="mb-4">
          <h3 className="text-[15px] font-extrabold text-white mb-0.5 uppercase truncate tracking-wide drop-shadow-md">
            {title}
          </h3>
          <p className="text-[10px] text-gray-300/80 uppercase font-bold tracking-widest drop-shadow-md">
            Action / RPG
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 uppercase font-black mb-0.5 tracking-tighter">Цена</span>
            <span className="text-lg font-black text-white leading-none">
              {price.toLocaleString()} ₽
            </span>
          </div>
          
          <button 
            onClick={() => addItem({ id, title, price, image })}
            className="w-10 h-10 bg-[#a855f7] hover:bg-[#9333ea] rounded-xl flex items-center justify-center transition-all shadow-[0_4px_15px_rgba(168,85,247,0.3)] hover:scale-110 active:scale-95"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}