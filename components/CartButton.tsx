"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";

interface CartButtonProps {
  onClick: () => void;
  totalAmount: number;
  totalItems: number;
}

export default function CartButton({ onClick, totalAmount, totalItems }: CartButtonProps) {
  return (
    <button
      onClick={onClick}
      // Применяем те же размеры и скругления, что и у других иконок
      className="group relative p-3 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center 
                 bg-[#00FFFF] border border-white/5 
                 shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
    >
      <div className="relative flex items-center justify-center gap-2">
        {/* Иконка корзины */}
        <ShoppingBag size={22} className="text-black group-hover:scale-105 transition-transform" />

        {/* Сумма (если больше 0) */}
        {totalAmount >= 0 && (
          <span className="text-sm font-black italic text-black -mb-0.5 whitespace-nowrap">
            {totalAmount} ₽
          </span>
        )}

        {/* Индикатор количества товаров (над иконкой) */}
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -left-1.5 bg-black text-[#00FFFF] text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#00FFFF]">
            {totalItems}
          </span>
        )}
      </div>

      {/* Внутренний блик для объема */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}