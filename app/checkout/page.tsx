"use client";

import React, { useState, useEffect } from "react";
import { useCartStore, getTotalPrice } from "@/store/useCart";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { getLoyaltyInfo } from "@/lib/loyalty";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft, CreditCard, Wallet, ShieldCheck,
  Zap, Mail, Check, Lock
} from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Банковская карта",
    icon: CreditCard,
    desc: "Visa, Mastercard, МИР",
    available: false,
    soon: true,
  },
  {
    id: "sbp",
    label: "СБП",
    icon: Zap,
    desc: "Система быстрых платежей",
    available: false,
    soon: true,
  },
  {
    id: "wallet",
    label: "Тестовая оплата",
    icon: Wallet,
    desc: "Для разработки — без реальных денег",
    available: true,
    soon: false,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, clearCart } = useCartStore();
  const [totalSpent, setTotalSpent] = useState(0);
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (session?.user?.email) setEmail(session.user.email);
  }, [session]);

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

  const loyalty = getLoyaltyInfo(totalSpent);
  const originalPrice = getTotalPrice(items);
  const discountAmount = Math.round(originalPrice * loyalty.discount / 100);
  const finalPrice = originalPrice - discountAmount;

  const handleCheckout = async () => {
    if (!email) { alert("Введи email"); return; }
    if (items.length === 0) { alert("Корзина пуста"); return; }
    if (!session?.user?.email) { alert("Войдите в аккаунт"); return; }

    setIsSubmitting(true);

    try {
      const preparedItems = items.map(item => ({
        game_id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));

      // Создаём заказ
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          items: preparedItems,
          total_price: finalPrice,
          status: "completed",
          user_email: session.user.email,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Обновляем лояльность
      const newTotalSpent = totalSpent + finalPrice;
      const newLoyalty = getLoyaltyInfo(newTotalSpent);
      await supabase
        .from("users")
        .update({
          total_spent: newTotalSpent,
          discount_percent: newLoyalty.discount,
          loyalty_level: newLoyalty.level,
        })
        .eq("email", session.user.email);

      // Выдаём ваучеры
      for (const item of items) {
        const code = `CLIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        await supabase.from("vouchers").insert({
          user_email: session.user.email,
          game_id: item.id,
          game_title: item.title,
          code,
          is_used: true,
          order_id: order.id,
        });
      }

      clearCart();
      router.push(`/order/success?orderId=${order.id}&email=${encodeURIComponent(email)}`);

    } catch (err: any) {
      console.error(err);
      alert("Ошибка: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return <div className="min-h-screen" />;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-white/30 font-black uppercase italic text-2xl">Корзина пуста</p>
        <Link href="/" className="px-8 py-4 bg-[#63f3f7] text-black font-black uppercase italic rounded-2xl">
          В магазин
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-[1100px] mx-auto">

        {/* Шапка */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <Link
            href="/cart"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#63f3f7] transition-all"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
              Оформление <span className="text-[#63f3f7]">заказа</span>
            </h1>
            <p className="text-white/30 text-xs mt-0.5">{items.length} товар{items.length > 1 ? "а" : ""} в корзине</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

          {/* Левая часть */}
          <div className="flex flex-col gap-6">

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#63f3f7]/10 border border-[#63f3f7]/20 flex items-center justify-center">
                  <Mail size={15} className="text-[#63f3f7]" />
                </div>
                <p className="text-white font-black uppercase italic text-sm tracking-widest">Email для получения ключей</p>
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 focus:border-[#63f3f7]/40 rounded-2xl text-white font-bold text-sm outline-none transition-all placeholder-white/20"
              />
              <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mt-3">
                Ключи активации придут на этот адрес сразу после оплаты
              </p>
            </motion.div>

            {/* Способ оплаты */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#63f3f7]/10 border border-[#63f3f7]/20 flex items-center justify-center">
                  <CreditCard size={15} className="text-[#63f3f7]" />
                </div>
                <p className="text-white font-black uppercase italic text-sm tracking-widest">Способ оплаты</p>
              </div>
              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => method.available && setPaymentMethod(method.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                        !method.available
                          ? "opacity-40 cursor-not-allowed border-white/5 bg-white/[0.01]"
                          : isSelected
                          ? "border-[#63f3f7]/40 bg-[#63f3f7]/5 shadow-[0_0_20px_rgba(99,243,247,0.05)]"
                          : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#63f3f7]/20" : "bg-white/5"}`}>
                          <Icon size={18} className={isSelected ? "text-[#63f3f7]" : "text-white/40"} />
                        </div>
                        <div>
                          <p className={`font-black text-sm uppercase italic ${isSelected ? "text-white" : "text-white/50"}`}>
                            {method.label}
                          </p>
                          <p className="text-white/20 text-[10px] font-bold">{method.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.soon && (
                          <span className="text-[8px] bg-[#63f3f7]/10 border border-[#63f3f7]/20 text-[#63f3f7] px-2 py-1 rounded-lg font-black uppercase">
                            Скоро
                          </span>
                        )}
                        {isSelected && method.available && (
                          <div className="w-5 h-5 rounded-full bg-[#63f3f7] flex items-center justify-center">
                            <Check size={12} className="text-black" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Гарантии */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { icon: ShieldCheck, text: "Безопасная оплата" },
                { icon: Zap, text: "Мгновенная доставка" },
                { icon: Lock, text: "Данные защищены" },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <item.icon size={18} className="text-[#63f3f7]" />
                  <p className="text-white/30 text-[9px] uppercase font-black tracking-widest text-center">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Правая часть — итого */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            {/* Товары */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4">
              <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em]">Ваш заказ</p>
              {items.map((item) => (
                <div key={item.cartItemId} className="flex items-center gap-3">
                  <div className="w-12 h-14 relative rounded-xl overflow-hidden shrink-0 border border-white/5">
                    <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-xs font-black uppercase italic truncate">{item.title}</p>
                    {item.quantity > 1 && (
                      <p className="text-white/30 text-[10px]">× {item.quantity}</p>
                    )}
                  </div>
                  <p className="text-[#63f3f7] text-sm font-black shrink-0">
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </p>
                </div>
              ))}
            </div>

            {/* Итого */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4">
              {loyalty.discount > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-white/30 text-xs font-black uppercase">Сумма</span>
                    <span className="text-white/30 text-sm font-black line-through">{originalPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#63f3f7] text-xs font-black uppercase">Скидка {loyalty.discount}%</span>
                    <span className="text-[#63f3f7] text-sm font-black">−{discountAmount.toLocaleString()} ₽</span>
                  </div>
                  <div className="h-px bg-white/5" />
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-xs font-black uppercase tracking-widest">Итого</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-black text-3xl italic">{finalPrice.toLocaleString()}</span>
                  <span className="text-[#63f3f7] font-black">₽</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className={`w-full py-5 rounded-2xl font-black uppercase italic text-sm tracking-widest transition-all flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-[#63f3f7]/50 cursor-wait text-black"
                    : "bg-[#63f3f7] text-black hover:shadow-[0_0_30px_rgba(99,243,247,0.3)] active:scale-95"
                }`}
              >
                <CreditCard size={18} />
                {isSubmitting ? "Обрабатываем..." : "Оплатить"}
              </button>

              <p className="text-white/15 text-[9px] uppercase tracking-widest text-center font-black">
                Нажимая кнопку, вы соглашаетесь с условиями использования
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}