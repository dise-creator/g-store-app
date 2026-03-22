"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import Image from "next/image";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } = useCartStore();
  const total = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  // Закрытие по клавише Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        toggleCart();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Блокируем скролл страницы при открытой корзине
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, toggleCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Темный фон за корзиной */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] cursor-pointer"
          />

          {/* Сама панель корзины */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0b] border-l border-white/10 z-[160] flex flex-col shadow-2xl"
          >
            {/* Шапка корзины */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="text-[#a855f7]" />
                <h2 className="text-xl font-black uppercase italic tracking-tighter">Корзина</h2>
              </div>
              <button onClick={toggleCart} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="text-white/40" />
              </button>
            </div>

            {/* Список товаров */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <ShoppingCart size={64} className="mb-4" />
                  <p className="font-black uppercase italic">Пусто</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-white/[0.03] rounded-2xl border border-white/5">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <h4 className="font-black uppercase italic text-sm leading-tight">{item.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[#a855f7] font-bold">{item.price} ₽</span>
                        <button onClick={() => removeItem(item.id)} className="text-white/20 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Футер с кнопкой оплаты */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                <div className="flex justify-between mb-4">
                  <span className="text-white/40 font-bold uppercase text-xs">Итого:</span>
                  <span className="text-2xl font-black text-white">{total.toLocaleString()} ₽</span>
                </div>
                <button className="w-full bg-[#a855f7] py-4 rounded-2xl font-black uppercase italic shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Оформить заказ
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}