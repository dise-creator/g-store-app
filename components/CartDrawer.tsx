"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";
import { supabase } from "@/lib/supabase"; // Импортируем supabase

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  // Защита от Hydration Error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Закрытие по нажатию Esc
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

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  // Функция оформления заказа (копируем логику из CartPage)
  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    console.log("CartDrawer: Начинаю оформление...");

    try {
      const preparedItems = items.map(item => ({
        game_id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }));

      const orderPayload = {
        items: preparedItems,
        total_price: Number(totalAmount),
        status: 'pending',
        user_email: "drawer_customer@example.com"
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select();

      if (error) throw error;

      console.log("Заказ создан через Drawer:", data);
      alert('✅ Заказ оформлен успешно!');
      clearCart();
      onClose(); // Закрываем корзину после успеха

    } catch (err: any) {
      console.error('Ошибка в Drawer:', err.message);
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200]">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Панель корзины */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 h-full w-full max-w-[420px] flex flex-col bg-[#0a0a0c]/95 backdrop-blur-2xl border-r border-white/5 shadow-[20px_0_80px_rgba(0,0,0,0.5)] rounded-r-[2.5rem] overflow-hidden"
          >
            {/* Шапка */}
            <div className="relative p-8 flex items-center justify-between border-b border-white/5">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag size={14} className="text-[#00FFFF]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                    My Collection
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                  Корзина
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-[#00FFFF] hover:text-black rounded-full transition-all text-white/50 border border-white/5"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Список товаров */}
            <div className="relative flex-1 overflow-y-auto px-6 py-8 no-scrollbar space-y-6">
              {items.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      layout
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group flex items-center gap-4 bg-white/5 p-3 rounded-[1.5rem] border border-white/5 hover:border-[#00FFFF]/20 transition-colors"
                    >
                      <div className="relative w-16 h-20 shrink-0 rounded-xl overflow-hidden shadow-2xl bg-white/10">
                        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-[11px] font-black uppercase italic text-white/90 truncate mb-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-[#00FFFF] font-black italic text-sm">
                            {(item.price || 0).toLocaleString()} ₽
                          </p>
                          <div className="flex items-center gap-3 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                              className="text-white/40 hover:text-[#00FFFF]"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                              className="text-white/40 hover:text-[#00FFFF]"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button onClick={() => removeItem(item.id)} className="p-2 text-white/10 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <ShoppingBag size={48} className="mb-4 text-white" />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Пусто</p>
                </div>
              )}
            </div>

            {/* Футер */}
            {items.length > 0 && (
              <div className="relative p-8 bg-black/60 backdrop-blur-md border-t border-white/5 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase italic text-white/40">Итого к оплате:</span>
                  <span className="text-3xl font-black italic text-[#00FFFF] tracking-tighter">
                    {totalAmount.toLocaleString()} ₽
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-[0_0_30px_rgba(0,255,255,0.1)] flex items-center justify-center gap-3 ${
                      isSubmitting 
                      ? "bg-gray-600 text-white/50 cursor-not-allowed" 
                      : "bg-[#00FFFF] text-black hover:scale-[1.02] active:scale-95"
                    }`}
                  >
                    <CreditCard size={20} />
                    {isSubmitting ? "Оформление..." : "Оформить заказ"}
                  </button>
                  <button onClick={clearCart} className="text-[10px] font-bold text-white/20 uppercase hover:text-white transition-colors tracking-widest">
                    Очистить корзину
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