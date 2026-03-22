"use client";

import React, { useEffect } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useCartStore } from "@/store/useCart";

interface HeaderProps {
  onSearchClick: () => void;
}

export default function Header({ onSearchClick }: HeaderProps) {
  const { items, toggleCart } = useCartStore();
  const controls = useAnimation();

  useEffect(() => {
    if (items.length > 0) {
      controls.start({
        scale: [1, 1.2, 0.9, 1.1, 1],
        transition: { duration: 0.4, ease: "easeInOut" }
      });
    }
  }, [items.length, controls]);

  const totalAmount = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] px-4 md:px-8 py-6">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
        
        {/* Логотип */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-[#a855f7] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-transform group-hover:rotate-12">
            <span className="text-white font-black text-xl">Г</span>
          </div>
          <span className="text-white font-black uppercase italic tracking-wider text-xl hidden sm:block">
            Магазин
          </span>
        </div>

        {/* Поле поиска */}
        <div 
          onClick={onSearchClick}
          className="flex-1 max-w-2xl relative group cursor-pointer"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-[#a855f7] transition-colors w-5 h-5" />
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white/20 text-sm backdrop-blur-md transition-all group-hover:border-[#a855f7]/50 group-hover:bg-white/10 leading-tight flex items-center h-[46px]">
            Поиск любимых игр...
          </div>
        </div>

        {/* Правый блок */}
        <div className="flex items-center gap-4">
          {items.length > 0 && (
            <div className="hidden md:block text-right">
              <p className="text-[10px] text-white/40 uppercase font-black leading-none mb-1">Итого</p>
              <p className="text-white font-black italic">{totalAmount.toLocaleString()} ₽</p>
            </div>
          )}

          <motion.button
            animate={controls}
            onClick={toggleCart}
            className="relative w-12 h-12 bg-[#a855f7] rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-[#9333ea] transition-all"
          >
            <ShoppingCart className="w-6 h-6" />
            {items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-[#a855f7] text-[10px] font-black w-5 h-5 rounded-lg flex items-center justify-center border-2 border-[#a855f7]">
                {items.length}
              </span>
            )}
          </motion.button>

          <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/50 hover:text-white transition-all">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#0a0a0b]/80 to-transparent -z-10 h-32" />
    </header>
  );
}