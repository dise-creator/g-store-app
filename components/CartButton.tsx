"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";

export default function CartButton({ onClick }: { onClick: () => void }) {
  const items = useCartStore((state) => state.items);
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  console.log("Кнопка корзины видит товаров:", totalItems);

  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 p-2 pr-4 rounded-2xl transition-all active:scale-95"
    >
      <div className="relative p-2 bg-[#a855f7] rounded-xl shadow-lg shadow-[#a855f7]/20">
        <ShoppingBag size={20} className="text-white" />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-white text-[#a855f7] text-[9px] font-black rounded-full flex items-center justify-center border border-[#a855f7]"
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-start">
        <span className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none">Корзина</span>
        <span className="text-sm font-black text-white italic">
          {totalPrice.toLocaleString()} ₽
        </span>
      </div>
    </button>
  );
}