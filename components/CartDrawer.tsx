"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity } = useCartStore();
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // --- ЛОГИКА ESCAPE ---
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      // Блокируем прокрутку сайта, когда корзина открыта
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);
  // ---------------------

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ФОНОВЫЙ СЛОЙ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] cursor-pointer"
          />

          {/* ПАНЕЛЬ КОРЗИНЫ */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-[#0a0a0b] border-l border-white/5 z-[999] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
          >
            {/* Шапка */}
            <div className="p-8 pb-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#a855f7]/10 rounded-lg">
                  <ShoppingBag size={20} className="text-[#a855f7]" />
                </div>
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
                  Корзина
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Список товаров */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-white/10" />
                  </div>
                  <p className="text-white/20 uppercase font-black italic text-xs tracking-[0.2em]">
                    Пусто
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-24 relative rounded-2xl overflow-hidden shrink-0 bg-white/5 border border-white/5">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    
                    <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                      <div>
                        <h4 className="text-white font-bold text-sm uppercase truncate leading-tight mb-1">
                          {item.title}
                        </h4>
                        <p className="text-white/20 text-[9px] uppercase font-black tracking-widest">
                          Digital Key
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg px-2 py-1 border border-white/5">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-white/40 hover:text-[#a855f7]"><Minus size={14}/></button>
                          <span className="text-white font-black text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white/40 hover:text-[#a855f7]"><Plus size={14}/></button>
                        </div>
                        <p className="text-white font-black italic text-sm">
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="opacity-0 group-hover:opacity-100 p-2 text-white/10 hover:text-red-500 transition-all self-start"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Футер */}
            {items.length > 0 && (
              <div className="p-8 bg-[#0c0c0e] border-t border-white/5 space-y-6">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Итого</span>
                    <span className="text-3xl text-white font-black italic tracking-tighter">
                      {totalAmount.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
                <button className="w-full py-5 bg-[#a855f7] rounded-2xl text-white font-black uppercase italic hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(168,85,247,0.2)]">
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