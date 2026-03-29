"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";

interface CartButtonProps {
  onClick: () => void; // Используем стандартное написание
  totalAmount: number;
  totalItems: number;
}

export default function CartButton({ onClick, totalAmount, totalItems }: CartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group relative h-12 px-5 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center 
                 bg-[#00FFFF] border border-white/10 
                 shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)]"
    >
      <div className="relative flex items-center gap-3">
        <div className="relative">
          <ShoppingBag size={20} className="text-black group-hover:rotate-[-10deg] transition-transform" />
          
          {totalItems > 0 && (
            <span className="absolute -top-2 -left-2 bg-black text-[#00FFFF] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#00FFFF] shadow-lg">
              {totalItems}
            </span>
          )}
        </div>

        <span className="text-[15px] font-black italic text-black tracking-tighter">
          {totalAmount.toLocaleString()} ₽
        </span>
      </div>

      {/* Эффект блика */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}