"use client";

import React, { useState, useEffect } from "react";
import { Search, Heart } from "lucide-react"; // Добавили Heart
import UserProfile from "./UserProfile";
import CartButton from "./CartButton"; 
import { useCartStore } from "@/store/useCart";
import { useWishlistStore } from "@/store/useWishlist"; // Импортируем стор избранного

interface HeaderProps {
  onSearchClick: () => void;
  onCartClick: () => void;
  onWishlistClick?: () => void; // Добавили проп для клика по избранному
}

export default function Header({ onSearchClick, onCartClick, onWishlistClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items); // Получаем айтемы избранного

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
  const wishlistCount = wishlistItems.length;

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1440px] z-[100] px-8 rounded-[2.5rem] transition-all duration-700 flex justify-between items-center transform-gpu will-change-[backdrop-filter,background-color] ${
      scrolled 
        ? "py-3 bg-black/[0.15] backdrop-blur-[40px] border border-white/[0.1] shadow-2xl" 
        : "py-6 bg-transparent backdrop-blur-[10px] border border-white/[0.05]"
    }`}>
      
      {/* Логотип CLIC */}
      <div className="relative group/logo cursor-pointer shrink-0 h-14 flex items-center">
        <div className="relative flex tracking-widest transition-all duration-500 skew-x-[-12deg] group-hover/logo:skew-x-[-10deg]">
          <h1 className="select-none flex items-end tracking-wider transition-all duration-500">
            <span 
              className="font-michroma text-white text-2xl md:text-3xl font-black transition-all duration-500 transform -translate-y-3 md:-translate-y-4 opacity-90"
              style={{ WebkitTextStroke: "2px white" }}
            >
              CL
            </span>
            <span className="relative flex items-center ml-1">
              <span 
                className="font-unbounded text-white text-4xl md:text-6xl font-black transition-all duration-500"
                style={{ 
                  WebkitTextStroke: "3px white",
                  textShadow: "6px 6px 0px rgba(0,0,0,1)" 
                }}
              >
                IC
              </span>
              <span 
                className="absolute inset-0 text-white blur-[2px] opacity-60 pointer-events-none group-hover/logo:opacity-90 transition-all" 
                style={{ 
                  WebkitTextStroke: "3.5px white",
                  filter: "drop-shadow(0 0 15px rgba(99,243,247,0.7))"
                }}
              >
                IC
              </span>
            </span>
          </h1>
          <div className="absolute -bottom-1 right-0 w-[50%] h-[5px] bg-[#63f3f7] opacity-0 group-hover/logo:opacity-100 blur-[3px] transition-all duration-500 shadow-[0_0_25px_#63f3f7] rounded-full scale-x-0 group-hover/logo:scale-x-100 origin-right" />
        </div>
      </div>

      <div className="relative flex items-center gap-3 md:gap-5">
        {/* Поиск */}
        <button 
          onClick={onSearchClick} 
          className="p-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl border border-white/5 transition-all active:scale-95 group"
        >
          <Search size={20} className="text-white/40 group-hover:text-[#63f3f7] transition-colors" />
        </button>

        {/* --- ИЗБРАННОЕ --- */}
        <button 
          onClick={onWishlistClick}
          className="relative p-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl border border-white/5 transition-all active:scale-95 group"
        >
          <Heart 
            size={20} 
            className={`transition-colors ${
              mounted && wishlistCount > 0 
                ? "text-[#63f3f7] fill-[#63f3f7]/20" 
                : "text-white/40 group-hover:text-[#63f3f7]"
            }`} 
          />
          {mounted && wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#63f3f7] text-black text-[9px] font-black rounded-full flex items-center justify-center animate-in zoom-in duration-300">
              {wishlistCount}
            </span>
          )}
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