"use client";

import React from "react";
import { Search, ShoppingCart, User } from "lucide-react";

// Описываем, что компонент принимает на вход
interface HeaderProps {
  onSearchClick: () => void;
  onCartClick: () => void;
}

export default function Header({ onSearchClick, onCartClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-[100] px-4 md:px-8 py-6">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
        <div className="text-white font-black uppercase italic tracking-wider text-xl">
          MY<span className="text-[#a855f7]">STORE</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onSearchClick} className="p-2 text-white/60 hover:text-white transition-colors">
            <Search size={22} />
          </button>

          <button 
            onClick={onCartClick} 
            className="w-12 h-12 bg-[#a855f7] rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-[#9333ea] transition-all"
          >
            <ShoppingCart className="w-6 h-6" />
          </button>

          <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/50 hover:text-white transition-all">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#0a0a0b]/80 to-transparent -z-10 h-32" />
    </header>
  );
}