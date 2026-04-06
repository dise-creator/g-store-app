"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";
import { supabase } from "@/lib/supabase";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Берем данные из твоего стора
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Блокировка скролла и закрытие по Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Считаем сумму, гарантируя числовой формат
  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  const handleCheckout = async () => {
    if (items.length === 0 || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const preparedItems = items.map(item => ({
        game_id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }));

      const { error } = await supabase
        .from('orders')
        .insert([{
          items: preparedItems,
          total_price: totalAmount,
          status: 'pending',
          user_email: "customer@example.com"
        }]);

      if (error) throw error;

      alert('✅ Заказ оформлен успешно!');
      clearCart();
      onClose();
    } catch (err: any) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-start justify-start">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Панель корзины */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative h-full w-full max-w-[420px] flex flex-col bg-[#0a0a0c] border-r border-white/5 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Шапка (БЕЗ My Collection) */}
            <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                Корзина
              </h2>
              <button
                onClick={onClose}
                className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-[#00FFFF] hover:text-black rounded-full transition-all text-white/50 border border-white/5 cursor-pointer"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            {/* Список товаров */}
            <div className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar space-y-4">
              {items.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      layout
                      // Ключ должен быть cartItemId для корректной анимации
                      key={item.cartItemId} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group flex items-center gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/5 hover:border-[#00FFFF]/20 transition-all"
                    >
                      <div className="relative w-20 h-24 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-black uppercase italic text-white/90 truncate mb-3">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-[#00FFFF] font-black italic text-lg">
                            {(Number(item.price) || 0).toLocaleString()} ₽
                          </p>
                          
                          {/* Управление количеством по cartItemId */}
                          <div className="flex items-center gap-4 bg-black/60 px-3 py-1.5 rounded-xl border border-white/5">
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} 
                              className="text-white/40 hover:text-[#00FFFF] transition-colors cursor-pointer p-1"
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} 
                              className="text-white/40 hover:text-[#00FFFF] transition-colors cursor-pointer p-1"
                            >
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Удаление по cartItemId */}
                      <button 
                        onClick={() => removeItem(item.cartItemId)} 
                        className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <ShoppingBag size={64} strokeWidth={1} className="mb-4 text-white" />
                  <p className="text-sm font-black uppercase italic tracking-widest text-white">Пусто</p>
                </div>
              )}
            </div>

            {/* Футер */}
            {items.length > 0 && (
              <div className="p-8 bg-black/80 backdrop-blur-xl border-t border-white/5 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase italic text-white/30 tracking-widest">Итого:</span>
                  <span className="text-4xl font-black italic text-[#00FFFF] tracking-tighter">
                    {totalAmount.toLocaleString()} ₽
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    className={`w-full py-6 rounded-2xl font-black uppercase italic tracking-[0.2em] transition-all shadow-[0_0_40px_rgba(0,255,255,0.15)] flex items-center justify-center gap-3 cursor-pointer ${
                      isSubmitting 
                      ? "bg-white/5 text-white/20 cursor-wait" 
                      : "bg-[#00FFFF] text-black hover:scale-[1.02] active:scale-95"
                    }`}
                  >
                    <CreditCard size={22} />
                    {isSubmitting ? "Оформление..." : "Оплатить заказ"}
                  </button>
                  <button 
                    onClick={clearCart} 
                    className="text-[10px] font-black text-white/20 uppercase hover:text-red-500 transition-colors tracking-[0.4em] cursor-pointer text-center"
                  >
                    Очистить список
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}