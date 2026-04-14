"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { getLoyaltyInfo } from "@/lib/loyalty";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);

  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { data: session } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function loadUserData() {
      if (!session?.user?.email) return;
      const { data } = await supabase
        .from("users")
        .select("total_spent")
        .eq("email", session.user.email)
        .single();
      if (data) setTotalSpent(Number(data.total_spent) || 0);
    }
    loadUserData();
  }, [session]);

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

  const originalAmount = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );
  const loyalty = getLoyaltyInfo(totalSpent);
  const discountAmount = Math.round(originalAmount * loyalty.discount / 100);
  const finalAmount = originalAmount - discountAmount;

  const handleCheckout = async () => {
    if (items.length === 0 || isSubmitting) return;

    if (!session?.user?.email) {
      alert("Войдите в аккаунт чтобы оформить заказ");
      return;
    }

    setIsSubmitting(true);
    try {
      const preparedItems = items.map(item => ({
        game_id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }));

      // 1. Создаём заказ
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          items: preparedItems,
          total_price: finalAmount,
          status: 'completed', // Сразу completed так как оплата мгновенная
          user_email: session.user.email,
        }]);

      if (orderError) throw orderError;

      // 2. Выдаём ключи для каждой игры в заказе
      for (const item of items) {
        for (let i = 0; i < item.quantity; i++) {
          // Ищем свободный ключ для этой игры
          const { data: voucher } = await supabase
            .from('vouchers')
            .select('id')
            .eq('game_id', item.id)
            .eq('is_used', false)
            .is('user_email', null)
            .limit(1)
            .single();

          // Если нашли ключ — привязываем к пользователю
          if (voucher) {
            await supabase
              .from('vouchers')
              .update({
                is_used: true,
                user_email: session.user.email,
                game_title: item.title,
              })
              .eq('id', voucher.id);
          }
        }
      }

      // 3. Обновляем total_spent и уровень лояльности
      const newTotalSpent = totalSpent + finalAmount;
      const newLoyalty = getLoyaltyInfo(newTotalSpent);

      const { error: userError } = await supabase
        .from('users')
        .update({
          total_spent: newTotalSpent,
          discount_percent: newLoyalty.discount,
          loyalty_level: newLoyalty.level,
        })
        .eq('email', session.user.email);

      if (userError) throw userError;

      alert('✅ Заказ оформлен! Ключи доступны в личном кабинете.');
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ x: "-110%" }}
            animate={{ x: 0 }}
            exit={{ x: "-110%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative h-full w-full max-w-[420px] flex flex-col bg-[#0a0a0c] border border-white/10 shadow-2xl overflow-hidden rounded-[2.5rem] md:rounded-[3rem]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Шапка */}
            <div className="p-8 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                Корзина
              </h2>
              <button
                onClick={onClose}
                className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-[#00FFFF] hover:text-black rounded-full transition-all text-white/50 border border-white/10 cursor-pointer"
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
                      key={item.cartItemId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group flex items-center gap-4 bg-white/[0.03] p-4 rounded-[1.8rem] border border-white/10 hover:border-[#00FFFF]/30 transition-all"
                    >
                      <div className="relative w-16 h-18 shrink-0 rounded-2xl overflow-hidden border border-white/10">
                        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-white/90 truncate mb-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-[#00FFFF] font-black italic text-base leading-none">
                            {(Number(item.price) || 0).toLocaleString()} ₽
                          </p>
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
              <div className="p-8 bg-black/80 backdrop-blur-xl border-t border-white/10 space-y-5">

                {loyalty.discount > 0 && (
                  <div className="flex flex-col gap-2 p-4 bg-[#00FFFF]/5 border border-[#00FFFF]/20 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <span className="text-white/30 text-[9px] uppercase font-black tracking-widest">Без скидки</span>
                      <span className="text-white/30 font-black text-sm line-through">{originalAmount.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#00FFFF] text-[9px] uppercase font-black tracking-widest">Скидка {loyalty.discount}% · {loyalty.level}</span>
                      <span className="text-[#00FFFF] font-black text-sm">−{discountAmount.toLocaleString()} ₽</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase italic text-white/30 tracking-widest">Итого:</span>
                  <span className="text-4xl font-black italic text-[#00FFFF] tracking-tighter leading-none">
                    {finalAmount.toLocaleString()} ₽
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleCheckout}
                    disabled={isSubmitting}
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