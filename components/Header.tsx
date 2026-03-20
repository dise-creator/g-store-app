"use client";

import { Search, ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/useCart";

export default function Header() {
  const { toggleCart, items, searchQuery, setSearchQuery } = useCartStore();
  
  const itemsCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-[#13151A]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1520px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Логотип */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0">
          <div className="w-10 h-10 bg-[#a855f7] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <span className="text-white font-black">G</span>
          </div>
          <span className="text-xl font-black uppercase tracking-tighter italic text-white">Store</span>
        </div>

        {/* СТРОКА ПОИСКА — ТЕПЕРЬ РАБОТАЕТ */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск любимых игр..."
            className="w-full bg-[#1c1f26] border border-white/5 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#a855f7]/50 transition-all text-sm text-white"
          />
        </div>

        {/* Корзина */}
        <button 
          onClick={toggleCart} 
          className="bg-[#a855f7] hover:bg-[#9333ea] px-6 py-3 rounded-2xl flex items-center gap-3 transition-all active:scale-95 cursor-pointer relative z-[110] shrink-0"
        >
          <ShoppingCart className="w-5 h-5 text-white" />
          <span className="font-bold text-sm uppercase text-white hidden sm:block">Корзина</span>
          {itemsCount > 0 && (
            <span className="bg-white text-[#a855f7] w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold">
              {itemsCount}
            </span>
          )}
        </button>

      </div>
    </header>
  );
}