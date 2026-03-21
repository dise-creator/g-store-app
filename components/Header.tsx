"use client";

import React from "react";
import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "../store/useCart";

interface HeaderProps {
  onSearchClick: () => void;
}

export default function Header({ onSearchClick }: HeaderProps) {
  const { toggleCart, items, totalPrice } = useCartStore();
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-[50] bg-[#0f1218]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[100px] flex items-center justify-between">
        
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-[#a855f7] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-transform hover:scale-110">
            <span className="text-white font-black text-xl italic">G</span>
          </div>
          <span className="text-white font-black text-xl tracking-tighter uppercase italic">Store</span>
        </Link>

        {/* Кнопка поиска (открывает модалку) */}
        <div 
          onClick={onSearchClick} 
          className="hidden md:flex flex-1 max-w-md mx-12 relative group cursor-pointer"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-[#a855f7] transition-colors" />
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-400 group-hover:border-[#a855f7]/30 transition-all">
            Поиск любимых игр...
          </div>
        </div>

        {/* Действия: Корзина (только значок) и Профиль */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Сумма слева от корзины, если она есть */}
          {totalPrice > 0 && (
            <span className="hidden sm:inline text-white/50 font-bold text-sm mr-2">
              {totalPrice.toLocaleString()} ₽
            </span>
          )}

          <button 
            onClick={toggleCart} 
            className="w-12 h-12 relative flex items-center justify-center bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-2xl transition-all active:scale-90"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-[#a855f7] text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#a855f7]">
                {itemsCount}
              </span>
            )}
          </button>
          
          <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors active:scale-90">
            <User className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}