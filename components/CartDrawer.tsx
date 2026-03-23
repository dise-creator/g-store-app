"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  // 1. Закрытие по нажатию Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay с мягким размытием */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[150]"
          />

          {/* Элегантная панель корзины */}
          <motion.div
            initial={{ x: "-100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className={`
              fixed left-0 top-0 h-full w-full max-w-[420px] z-[200] flex flex-col
              bg-[#0f0f13]/80 backdrop-blur-3xl backdrop-saturate-150
              border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.3)]
              rounded-r-[2.5rem] /* Тот самый изысканный край */
            `}
          >
            {/* Декоративный градиент на фоне внутри панели */}
            <div className="absolute inset-0 bg-radial-at-tl from-[#a855f7]/5 via-transparent to-transparent pointer-events-none rounded-r-[2.5rem]" />

            {/* Шапка */}
            <div className="relative p-8 flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag size={16} className="text-[#a855f7]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                    Your Selection
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                  Корзина
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white border border-white/5 active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Список товаров */}
            <div className="relative flex-1 overflow-y-auto px-8 py-2 no-scrollbar space-y-6">
              {items.length > 0 ? (
                items.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group flex items-center gap-5"
                  >
                    {/* Изображение с мягким свечением */}
                    <div className="relative w-20 h-28 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-lg transition-transform group-hover:scale-105 duration-500">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Информация */}
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-white/80 leading-tight line-clamp-2">
                          {item.title}
                        </h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-white/10 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-[#a855f7] font-black italic text-base">
                          {item.price.toLocaleString()} ₽
                        </p>
                        
                        {/* Компактный контроллер количества */}
                        <div className="flex items-center gap-3 bg-white/5 px-2 py-1 rounded-xl border border-white/5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-white/30 hover:text-white transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-white min-w-[12px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-white/30 hover:text-white transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                    <ShoppingBag size={24} className="opacity-20" />
                  </div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-20 text-white">
                    Список пуст
                  </p>
                </div>
              )}
            </div>

            {/* Футер: Итоговая информация */}
            {items.length > 0 && (
              <div className="relative p-8 bg-gradient-to-t from-black/40 to-transparent space-y-6 rounded-br-[2.5rem]">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <span>Всего позиций</span>
                    <span>{items.reduce((a, b) => a + b.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black uppercase italic text-white/60">Итого:</span>
                    <span className="text-3xl font-black italic text-white tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                      {totalAmount.toLocaleString()} ₽
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="relative w-full py-5 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-2xl font-black uppercase italic tracking-[0.15em] transition-all active:scale-[0.97] shadow-[0_20px_40px_rgba(168,85,247,0.3)] group overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-3 text-sm">
                      <CreditCard size={18} />
                      Оформить заказ
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                  
                  <button 
                    onClick={clearCart}
                    className="py-2 text-[9px] font-bold text-white/20 uppercase hover:text-white transition-colors tracking-[0.3em]"
                  >
                    Очистить всё
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}