"use client";

import React from "react";
import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "../store/useCart";

export default function Header() {
  const { toggleCart, toggleSearch, items, totalPrice } = useCartStore();
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-[50] bg-[#0f1218]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[100px] flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#a855f7] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-transform group-hover:scale-110">
            <span className="text-white font-black text-xl italic">G</span>
          </div>
          <span className="text-white font-black text-xl tracking-tighter uppercase italic">Store</span>
        </Link>

        <div onClick={toggleSearch} className="hidden md:flex flex-1 max-w-md mx-12 relative group cursor-pointer">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-[#a855f7] transition-colors" />
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-400 group-hover:border-[#a855f7]/30">
            Поиск любимых игр...
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleCart} className="flex items-center gap-3 bg-[#a855f7] hover:bg-[#9333ea] text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#a855f7] text-[10px] flex items-center justify-center rounded-full border-2 border-[#a855f7]">
                  {itemsCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Корзина</span>
            {totalPrice > 0 && <span className="hidden sm:inline opacity-60 ml-1 border-l border-white/20 pl-3">{totalPrice.toLocaleString()} ₽</span>}
          </button>
          <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}