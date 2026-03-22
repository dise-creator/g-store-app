"use client";

import React from "react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";
import { motion } from "framer-motion";

interface GameCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function GameCard({ id, title, price, image }: GameCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleCardClick = () => {
    addItem({ id, title, price, image });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group relative cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 1. Картинка — уменьшил нижний отступ с mb-5 до mb-2 */}
      <div className="relative h-72 w-full mb-2 rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#121214]">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
        />
      </div>
      
      {/* 2. Текстовый блок */}
      <div className="px-1">
        {/* Название: mb-0.5 вместо mb-1 для минимального зазора */}
        <h3 className="text-white font-black italic uppercase text-[11px] mb-0.5 truncate tracking-tighter group-hover:text-[#a855f7] transition-colors">
          {title}
        </h3>
        
        {/* Подпись: mb-1 вместо mb-4, чтобы цена «прилипла» выше */}
        <p className="text-white/20 text-[8px] uppercase font-bold tracking-widest mb-1">
          Digital Key
        </p>

        {/* Цена */}
        <p className="text-base font-black italic text-white tracking-tighter">
          {price.toLocaleString()} ₽
        </p>
      </div>

      {/* Свечение */}
      <div className="absolute -inset-2 rounded-[3rem] bg-[#a855f7]/5 opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-500 z-[-1]" />
    </motion.div>
  );
}