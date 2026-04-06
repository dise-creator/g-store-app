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
  
  // Подключаем стор
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

  // Расчет суммы
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

      alert('✅ Заказ успешно оформлен!');
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
        <div className="fixed inset-0 z-[999] flex items-start justify-start p-4 md:p-6">
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
            initial={{ x: "-110%" }} // Чуть больше смещение для плавности
            animate={{ x: 0 }}
            exit={{ x: "-110%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            // ИСПРАВЛЕНО: Добавлены скругления углов (rounded-r-[3rem] и rounded-l-[3rem] для симметрии в паддинге)
            className="relative h-full w-full max-w-[420px] flex flex-col bg-[#0a0a0c] border border-white/10 shadow-2xl overflow-hidden rounded-[2.5rem] md:rounded-[3rem]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Шапка (Компактная) */}
            <div className="p-8 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                Корзина
              </h2>
              <button
                onClick={onClose}
                // ИСПРАВЛЕНО: Скругление кнопки закрытия
                className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-[#00FFFF] hover:text-black rounded-full transition-all text-white/50 border border-white/10 cursor-pointer"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            {/* Список товаров (Компактный) */}
            <div className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar space-y-4">
              {items.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.cartItemId} // Используем cartItemId
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      // ИСПРАВЛЕНО: Закругление карточки товара (rounded-[1.5rem])
                      className="group flex items-center gap-4 bg-white/[0.03] p-4 rounded-[1.8rem] border border-white/10 hover:border-[#00FFFF]/30 transition-all"
                    >
                      {/* Изображение */}
                      {/* ИСПРАВЛЕНО: Закругление миниатюры (rounded-xl) */}
                      <div className="relative w-16 h-18 shrink-0 rounded-2xl overflow-hidden border border-white/10">
                        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                      </div>

                      {/* Инфо */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-white/90 truncate mb-2">
                          {item.title}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-[#00FFFF] font-black italic text-base leading-none">
                            {(Number(item.price) || 0).toLocaleString()} ₽
                          </p>
                          
                          {/* Управление количеством (cartItemId) */}
                          {/* ИСПРАВЛЕНО: Закругление счетчика (rounded-lg) */}
                          <div className="flex items-center gap-2.5 bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5">
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} 
                              className="text-white/30 hover:text-[#00FFFF] transition-colors p-0.5 cursor-pointer"
                            >
                              <Minus size={12} strokeWidth={2.5} />
                            </button>
                            <span className="text-[12px] font-bold text-white w-3 text-center leading-none">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} 
                              className="text-white/30 hover:text-[#00FFFF] transition-colors p-0.5 cursor-pointer"
                            >
                              <Plus size={12} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Удаление (cartItemId) */}
                      {/* ИСПРАВЛЕНО: Закругление кнопки удаления (rounded-lg) */}
                      <button 
                        onClick={() => removeItem(item.cartItemId)} 
                        className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <ShoppingBag size={48} strokeWidth={1} className="mb-2 text-white" />
                  <p className="text-[10px] font-black uppercase italic tracking-[0.3em] text-white">Пусто</p>
                </div>
              )}
            </div>

            {/* Футер */}
            {items.length > 0 && (
              <div className="p-8 bg-black/80 backdrop-blur-xl border-t border-white/10 space-y-7">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase italic text-white/30 tracking-widest">Итого:</span>
                  <span className="text-4xl font-black italic text-[#00FFFF] tracking-tighter leading-none">
                    {totalAmount.toLocaleString()} ₽
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    // ИСПРАВЛЕНО: Скругление главной кнопки оплаты (rounded-xl)
                    className={`w-full py-6 rounded-2xl font-black uppercase italic tracking-[0.2em] transition-all flex items-center justify-center gap-3 cursor-pointer ${
                      isSubmitting 
                      ? "bg-white/5 text-white/20 cursor-wait" 
                      : "bg-[#00FFFF] text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(0,255,255,0.1)]"
                    }`}
                  >
                    <CreditCard size={18} />
                    <span className="text-sm">{isSubmitting ? "Оформление..." : "Оплатить заказ"}</span>
                  </button>
                  <button 
                    onClick={clearCart} 
                    className="text-[9px] font-black text-white/20 uppercase hover:text-red-500 transition-colors tracking-[0.3em] cursor-pointer text-center py-2"
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