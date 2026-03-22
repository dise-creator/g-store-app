"use client";

import React from "react";
import { Search } from "lucide-react";
import UserProfile from "./UserProfile";
import CartButton from "./CartButton"; 

interface HeaderProps {
  onSearchClick: () => void;
  onCartClick: () => void;
}

export default function Header({ onSearchClick, onCartClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-[100] px-6 py-4 md:px-12 md:py-6 flex justify-between items-center bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white">
          GAME<span className="text-[#a855f7]">STORE</span>
        </h1>
        <span className="text-[7px] uppercase tracking-[0.3em] text-white/20 font-bold -mt-1 ml-0.5">
          Digital Universe
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onSearchClick}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-95 group"
        >
          <Search size={22} className="text-white/70 group-hover:text-white transition-colors" />
        </button>

        <UserProfile />

        {/* ВОТ ОНА — ТВОЯ КНОПКА С СУММОЙ */}
        <CartButton onClick={onCartClick} />
      </div>
    </header>
  );
}