"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity } = useCartStore();
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999]"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full md:w-[400px] bg-[#0a0a0b] border-r border-white/5 z-[1000] p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Корзина</h2>
              <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-all">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
              {items.length === 0 ? (
                <div className="text-center text-white/10 mt-20 uppercase font-black italic text-xs tracking-widest">Пусто</div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-16 h-20 relative rounded-xl overflow-hidden shrink-0 bg-white/5">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-1">
                      <h4 className="text-white font-bold text-xs uppercase truncate leading-tight">{item.title}</h4>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-white/20 hover:text-white"><Minus size={14}/></button>
                        <span className="text-white font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white/20 hover:text-white"><Plus size={14}/></button>
                      </div>
                      <p className="text-[#a855f7] font-black text-sm">{(item.price * item.quantity).toLocaleString()} ₽</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-white/10 hover:text-red-500 transition-colors self-start p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">Итого</span>
                  <span className="text-2xl text-white font-black italic">{totalAmount.toLocaleString()} ₽</span>
                </div>
                <button className="w-full py-4 bg-[#a855f7] rounded-xl text-white font-black uppercase italic hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#a855f7]/20">
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