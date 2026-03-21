"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { useCartStore } from '../store/useCart';

// 1. Явно объявляем интерфейс
interface GameCardProps {
  id: number;
  title: string;
  price: number;
  discount: string;
  image: string;
}

// 2. Типизируем пропсы компонента
export default function GameCard({ id, title, price, discount, image }: GameCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="bg-[#1e2530] rounded-3xl overflow-hidden border border-white/5 group hover:border-[#a855f7]/50 transition-all duration-500">
      <div className="relative h-[420px]">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-[#a855f7] text-white text-xs font-black px-2 py-1 rounded-lg">
          {discount}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-white font-bold text-sm uppercase truncate mb-4">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white font-black text-lg">{price.toLocaleString()} ₽</span>
          </div>
          <button 
            onClick={() => addItem({ id, title, price, image })}
            className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-[#a855f7] transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}