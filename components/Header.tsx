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
  
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1440px] z-[100] px-8 rounded-[2.5rem] transition-all duration-700 flex justify-between items-center transform-gpu will-change-[backdrop-filter,background-color] ${
      scrolled 
        ? "py-3 bg-black/[0.15] backdrop-blur-[40px] border border-white/[0.1] shadow-2xl" 
        : "py-6 bg-transparent backdrop-blur-[10px] border border-white/[0.05]"
    }`}>
      
      {/* Логотип CLIC в стиле Michroma */}
      <div className="relative flex items-center group cursor-pointer shrink-0 h-12">
        <h1 className="font-michroma uppercase select-none flex items-baseline gap-1 transition-all duration-500">
          <span 
            className="text-white/20 text-xl md:text-2xl tracking-[0.1em] transition-all duration-500 group-hover:text-white/50"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}
          >
            CL
          </span>
          <span className="relative flex items-center ml-0.5">
            <span 
              className="text-[#63f3f7] text-3xl md:text-5xl tracking-[0.15em] transition-all duration-500 
                drop-shadow-[0_0_15px_rgba(99,243,247,0.6)] 
                group-hover:drop-shadow-[0_0_35px_rgba(99,243,247,0.9)]"
              style={{ 
                WebkitTextStroke: "2.5px #63f3f7",
                textShadow: "4px 4px 0px rgba(0,0,0,0.8)" 
              }}
            >
              IC
            </span>
            {/* Эффект свечения изнутри */}
            <span className="absolute inset-0 text-[#63f3f7] text-3xl md:text-5xl blur-[2px] opacity-40 pointer-events-none" style={{ WebkitTextStroke: "2.5px #63f3f7" }}>
              IC
            </span>
          </span>
        </h1>
      </div>

      <div className="relative flex items-center gap-3 md:gap-5">
        {/* Кнопка поиска */}
        <button 
          onClick={onSearchClick} 
          className="p-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl border border-white/5 transition-all active:scale-95 group"
        >
          <Search size={20} className="text-white/40 group-hover:text-[#63f3f7] transition-colors" />
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-1 hidden md:block" />

        <div className="flex items-center gap-3">
          <UserProfile />
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