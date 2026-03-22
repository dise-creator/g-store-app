"use client";

import React from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/useCart";

interface HeaderProps {
  onSearchClick: () => void;
  onCartClick: () => void;
}

export default function Header({ onSearchClick, onCartClick }: HeaderProps) {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] px-6 py-4 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="text-white font-black uppercase italic text-xl tracking-tighter">
          MY<span className="text-[#a855f7]">STORE</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={onSearchClick} className="p-2.5 text-white/40 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          
          <button 
            onClick={onCartClick} 
            className="group relative p-3 bg-[#a855f7] rounded-2xl text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#a855f7] text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            )}
          </button>

          <button className="p-2.5 text-white/40 hover:text-white transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}