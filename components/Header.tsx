"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import UserProfile from "./UserProfile";
import CartButton from "./CartButton"; 
import { useCartStore } from "@/store/useCart";

interface HeaderProps {
  onSearchClick: () => void;
  onCartClick: () => void;
}

export default function Header({ onSearchClick, onCartClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Подключаем стор для расчета итогов
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Расчет итогов для передачи в кнопку
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Стили для твоего фирменного 3D логотипа
  const dark3D = {
    color: "#2D3748",
    textShadow: "0 1px 0 #1a202c, 0 2px 0 #1a202c, 0 3px 0 #1a202c, 0 4px 6px rgba(0,0,0,0.5)"
  };

  const viper3D = {
    color: "#00FFFF",
    textShadow: "0 1px 0 #00e6e6, 0 2px 0 #00cccc, 0 0 15px rgba(0, 255, 255, 0.8), 0 4px 8px rgba(0,0,0,0.4)"
  };

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1440px] z-[100] px-8 rounded-[2rem] transition-all duration-500 flex justify-between items-center ${
      scrolled 
        ? "py-4 bg-black/60 backdrop-blur-3xl border border-white/10 shadow-2xl" 
        : "py-6 bg-white/[0.03] backdrop-blur-md border border-white/5"
    }`}>
      
      {/* Логотип CLIC */}
      <div className="relative flex items-center group cursor-pointer shrink-0">
        <h1 className="flex items-baseline font-black italic uppercase tracking-tighter select-none scale-110 md:scale-125 origin-left">
          <span style={dark3D} className="text-3xl md:text-4xl">C</span>
          <span style={dark3D} className="text-3xl md:text-4xl mr-1.5">L</span>
          <span style={viper3D} className="text-4xl md:text-5xl">I</span>
          <span style={viper3D} className="text-4xl md:text-5xl">C</span>
        </h1>
      </div>

      <div className="relative flex items-center gap-3 md:gap-5">
        {/* Кнопка поиска */}
        <button 
          onClick={onSearchClick} 
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all active:scale-95 group"
        >
          <Search size={20} className="text-white/60 group-hover:text-[#00ffff] transition-colors" />
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-1 hidden md:block" />

        <div className="flex items-center gap-3">
          <UserProfile />
          
          {/* Наша исправленная кнопка корзины */}
          <CartButton 
            onClick={onCartClick} 
            totalAmount={mounted ? totalAmount : 0} 
            totalItems={mounted ? totalItems : 0} 
          />
        </div>
      </div>
    </header>
  );
}