"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import UserProfile from "./UserProfile";
import CartButton from "./CartButton"; 

interface HeaderProps {
  onSearchClick: () => void;
  onCartClick: () => void;
}

export default function Header({ onSearchClick, onCartClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1440px] z-[100] 
        px-8 rounded-[2rem] transition-all duration-500 ease-out
        flex justify-between items-center
        /* Эффект плавающей панели */
        ${scrolled 
          ? "py-4 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
          : "py-6 bg-white/[0.03] backdrop-blur-md border border-white/5"
        }
      `}
    >
      {/* Внутреннее свечение для эффекта объема */}
      <div className="absolute inset-0 rounded-[2rem] pointer-events-none bg-gradient-to-br from-white/[0.05] to-transparent" />

      {/* Логотип */}
      <div className="relative flex flex-col group cursor-pointer shrink-0">
        <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white">
          GAME<span className="text-[#a855f7] drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">STORE</span>
        </h1>
        <span className="text-[7px] uppercase tracking-[0.3em] text-white/30 font-bold -mt-1 ml-0.5">
          Digital Universe
        </span>
      </div>

      {/* Правая часть */}
      <div className="relative flex items-center gap-3 md:gap-5">
        <button
          onClick={onSearchClick}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all active:scale-95 group"
        >
          <Search size={20} className="text-white/60 group-hover:text-white transition-colors" />
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-1 hidden md:block" />

        <div className="flex items-center gap-3">
          <UserProfile />
          <CartButton onClick={onCartClick} />
        </div>
      </div>
    </header>
  );
}