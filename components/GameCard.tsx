"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCart";

interface GameCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  discount?: string;
}

export default function GameCard({ id, title, price, image, discount }: GameCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [mounted, setMounted] = useState(false);

  // Ждем, пока компонент появится в браузере
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCardClick = (e: React.MouseEvent) => {
    // Останавливаем другие события
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Клик сработал для:", title);
    addItem({ id, title, price, image });

    const tg = (window as any).Telegram?.WebApp;
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred("light");
    }
  };

  // Пока не смонтировано, показываем пустую рамку, чтобы не было ошибок
  if (!mounted) return <div className="w-full aspect-[3/4] bg-white/5 rounded-[32px] animate-pulse" />;

  return (
    <div 
      onClick={handleCardClick}
      className="relative group w-full aspect-[3/4] rounded-[32px] overflow-hidden cursor-pointer active:scale-95 transition-all duration-500 shadow-2xl border border-white/5 z-10"
    >
      <img 
        src={image} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1218] via-[#0f1218]/20 to-transparent opacity-90" />

      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <h3 className="text-white font-black text-2xl uppercase italic leading-none">{title}</h3>
        <div className="text-white font-black text-3xl mt-2">
          {price.toLocaleString()} <span className="text-sm">₽</span>
        </div>
      </div>
    </div>
  );
}