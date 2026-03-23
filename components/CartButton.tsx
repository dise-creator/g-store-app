"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";

// Описываем типы для входящих данных
interface CartButtonProps {
  onClick: () => void;
  totalAmount: number;
  totalItems: number;
}

export default function CartButton({ onClick, totalAmount, totalItems }: CartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-3 bg-[#a855f7] hover:bg-[#9333ea] text-white px-5 py-2.5 rounded-2xl transition-all active:scale-95 shadow-[0_10px_20px_rgba(168,85,247,0.3)] group"
    >
      {/* Иконка с индикатором количества */}
      <div className="relative">
        <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-[#a855f7] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
            {totalItems}
          </span>
        )}
      </div>

      {/* Текст и сумма */}
      <div className="flex flex-col items-start leading-none">
        <span className="text-[9px] uppercase font-black tracking-widest opacity-60">Корзина</span>
        <span className="text-sm font-black italic uppercase tracking-tighter">
          {totalAmount.toLocaleString()} ₽
        </span>
      </div>
    </button>
  );
}