"use client";

import { useCartStore } from "../store/useCart";
import { X, Trash2, ShoppingBag, CreditCard } from "lucide-react";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem } = useCartStore();

  // Считаем общую сумму, учитывая количество каждой игры
const totalPrice = items.reduce((acc, item) => acc + (item.price * (item.quantity || 0)), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={toggleCart} />
      
      <div className="relative w-full max-w-[420px] bg-[#121820] h-full shadow-2xl flex flex-col border-l border-white/5 animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1a212c]">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">Корзина</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-white/5 rounded-full text-gray-400 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#121820]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-30">
              <ShoppingBag className="w-12 h-12 mb-2" />
              <p>Тут пока пусто</p>
            </div>
          ) : (
            items.map((item: any) => (
              <div key={item.id} className="flex gap-4 bg-[#1e2530] p-4 rounded-2xl border border-white/5 items-center group">
                <div className="w-16 h-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                  <p className="text-[#a855f7] font-black">{item.price.toLocaleString()} ₽</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-500 p-2 cursor-pointer">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-white/5 bg-[#1a212c]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-xs uppercase font-bold">Итого:</span>
            <span className="text-2xl font-black text-white">{totalPrice.toLocaleString()} ₽</span>
          </div>
          <button className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-4 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            <span>Оформить покупку</span>
          </button>
        </div>
      </div>
    </div>
  );
}