"use client";

import React, { useState, useEffect } from "react";
import { useCartStore, getTotalPrice } from "@/store/useCart";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { getLoyaltyInfo } from "@/lib/loyalty";
import { selectCards } from "@/lib/cardSelector";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  CreditCard,
  Wallet,
  ShieldCheck,
  Zap,
  Mail,
  Check,
  Lock,
  Tag,
  X,
  Loader2,
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

const TRUST_BADGES = [
  { icon: ShieldCheck, text: "Безопасная оплата" },
  { icon: Zap, text: "Мгновенная доставка" },
  { icon: Lock, text: "Данные защищены" },
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

  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<{
    promo_id: string;
    type: "percent" | "fixed";
    value: number;
    discount: number;
  } | null>(null);

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
  const loyaltyDiscount = Math.round((originalPrice * loyalty.discount) / 100);
  const priceAfterLoyalty = originalPrice - loyaltyDiscount;
  const promoDiscount = appliedPromo
    ? Math.min(appliedPromo.discount, priceAfterLoyalty)
    : 0;
  const finalPrice = priceAfterLoyalty - promoDiscount;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError(null);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput, total: priceAfterLoyalty }),
      });
      const data = await res.json();
      if (!data.ok) {
        setPromoError(data.message);
        setAppliedPromo(null);
      } else {
        setAppliedPromo(data);
        setPromoError(null);
      }
    } catch {
      setPromoError("Ошибка проверки промокода");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError(null);
  };

  const handleCheckout = async () => {
    if (!email) {
      alert("Введи email");
      return;
    }
    if (items.length === 0) {
      alert("Корзина пуста");
      return;
    }
    if (!session?.user?.email) {
      alert("Войдите в аккаунт");
      return;
    }

    setIsSubmitting(true);

    try {
      const preparedItems = items.map((item) => ({
        game_id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        region: item.region || "TR",
      }));

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            items: preparedItems,
            total_price: finalPrice,
            status: "completed",
            user_email: session.user.email,
            promo_id: appliedPromo?.promo_id || null,
            promo_discount: promoDiscount || null,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      if (appliedPromo) {
        await supabase.rpc("increment_promo_usage", {
          promo_id: appliedPromo.promo_id,
        });
      }

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

      const allVouchers: {
        code: string;
        game_title: string;
        denomination: number;
      }[] = [];

      for (const item of items) {
        const itemRegion = item.region || "TR";
        const cards = selectCards(item.price);

        for (let i = 0; i < item.quantity; i++) {
          for (const card of cards) {
            for (let q = 0; q < card.quantity; q++) {
              const { data: voucher } = await supabase
                .from("vouchers")
                .select("*")
                .eq("denomination", card.value)
                .eq("region", itemRegion)
                .eq("is_used", false)
                .is("user_email", null)
                .limit(1)
                .single();

              if (!voucher) {
                throw new Error(
                  `Нет ключей номинала ${card.value} ₽ для региона ${itemRegion}. Обратитесь в поддержку.`,
                );
              }

              await supabase
                .from("vouchers")
                .update({
                  is_used: true,
                  user_email: session.user.email,
                  order_id: order.id,
                  game_title: item.title,
                  game_id: item.id,
                })
                .eq("id", voucher.id);

              allVouchers.push({
                code: voucher.code,
                game_title: item.title,
                denomination: card.value,
              });
            }
          }
        }
      }

      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          items: preparedItems,
          total: finalPrice,
          email,
          vouchers: allVouchers,
        }),
      }).catch(() => {});

      clearCart();
      router.push(
        `/order/success?orderId=${order.id}&email=${encodeURIComponent(email)}`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Неизвестная ошибка";
      alert("Ошибка: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return <div className="min-h-screen" />;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-white/30 font-black uppercase text-2xl">
          Корзина пуста
        </p>
        <Link
          href="/"
          className="px-8 py-4 bg-[#00d68f] text-black font-black uppercase rounded-2xl"
        >
          В магазин
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00d68f] transition-all"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase text-white tracking-tighter">
              Оформление <span className="text-[#00d68f]">заказа</span>
            </h1>
            <p className="text-white/30 text-xs mt-0.5">
              {items.length} товар{items.length > 1 ? "а" : ""} в корзине
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="flex flex-col gap-6">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#00d68f]/10 border border-[#00d68f]/20 flex items-center justify-center">
                  <Mail size={15} className="text-[#00d68f]" />
                </div>
                <p className="text-white font-black uppercase text-sm tracking-widest">
                  Email для получения ключей
                </p>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 focus:border-[#00d68f]/40 rounded-2xl text-white font-bold text-sm outline-none transition-all placeholder-white/20"
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
                <div className="w-8 h-8 rounded-xl bg-[#00d68f]/10 border border-[#00d68f]/20 flex items-center justify-center">
                  <CreditCard size={15} className="text-[#00d68f]" />
                </div>
                <p className="text-white font-black uppercase text-sm tracking-widest">
                  Способ оплаты
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() =>
                        method.available && setPaymentMethod(method.id)
                      }
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                        !method.available
                          ? "opacity-40 cursor-not-allowed border-white/5 bg-white/[0.01]"
                          : isSelected
                            ? "border-[#00d68f]/40 bg-[#00d68f]/5 shadow-[0_0_20px_rgba(99,243,247,0.05)]"
                            : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#00d68f]/20" : "bg-white/5"}`}
                        >
                          <Icon
                            size={18}
                            className={
                              isSelected ? "text-[#00d68f]" : "text-white/40"
                            }
                          />
                        </div>
                        <div>
                          <p
                            className={`font-black text-sm uppercase ${isSelected ? "text-white" : "text-white/50"}`}
                          >
                            {method.label}
                          </p>
                          <p className="text-white/20 text-[10px] font-bold">
                            {method.desc}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.soon && (
                          <span className="text-[8px] bg-[#00d68f]/10 border border-[#00d68f]/20 text-[#00d68f] px-2 py-1 rounded-lg font-black uppercase">
                            Скоро
                          </span>
                        )}
                        {isSelected && method.available && (
                          <div className="w-5 h-5 rounded-full bg-[#00d68f] flex items-center justify-center">
                            <Check size={12} className="text-black" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Бейджи */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-3"
            >
              {TRUST_BADGES.map((item) => (
                <div
                  key={item.text}
                  className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl"
                >
                  <item.icon size={18} className="text-[#00d68f]" />
                  <p className="text-white/30 text-[9px] uppercase font-black tracking-widest text-center">
                    {item.text}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Правая колонка */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            {/* Список товаров */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4">
              <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em]">
                Ваш заказ
              </p>
              {items.map((item) => (
                <div key={item.cartItemId} className="flex items-center gap-3">
                  <div className="w-12 h-14 relative rounded-xl overflow-hidden shrink-0 border border-white/5">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-xs font-black uppercase truncate">
                      {item.title}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-white/30 text-[10px]">
                        × {item.quantity}
                      </p>
                    )}
                  </div>
                  <p className="text-[#00d68f] text-sm font-black shrink-0">
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </p>
                </div>
              ))}
            </div>

            {/* Промокод */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#00d68f]/10 border border-[#00d68f]/20 flex items-center justify-center">
                  <Tag size={15} className="text-[#00d68f]" />
                </div>
                <p className="text-white font-black uppercase text-sm tracking-widest">
                  Промокод
                </p>
              </div>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-[#00d68f]/10 border border-[#00d68f]/20 rounded-2xl">
                  <div>
                    <p className="text-[#00d68f] font-black text-sm">
                      {promoInput.toUpperCase()}
                    </p>
                    <p className="text-[#00d68f]/60 text-[10px] font-black">
                      −
                      {appliedPromo.type === "percent"
                        ? `${appliedPromo.value}%`
                        : `${appliedPromo.value}₽`}{" "}
                      применено
                    </p>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-white/30 hover:text-red-400 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) =>
                      setPromoInput(e.target.value.toUpperCase())
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    placeholder="CLIC-XXXX-XXXX"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-sm focus:outline-none focus:border-[#00d68f]/40 transition-all placeholder-white/20"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoInput}
                    className="px-4 py-3 bg-[#00d68f]/10 border border-[#00d68f]/20 text-[#00d68f] rounded-2xl font-black text-xs uppercase hover:bg-[#00d68f]/20 transition-all disabled:opacity-40 flex items-center gap-1"
                  >
                    {promoLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    OK
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-red-400 text-[10px] font-black mt-2">
                  {promoError}
                </p>
              )}
            </div>

            {/* Итого */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4">
              {loyalty.discount > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-white/30 text-xs font-black uppercase">
                      Сумма
                    </span>
                    <span className="text-white/30 text-sm font-black line-through">
                      {originalPrice.toLocaleString()} ₽
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00d68f] text-xs font-black uppercase">
                      Скидка {loyalty.discount}%
                    </span>
                    <span className="text-[#00d68f] text-sm font-black">
                      −{loyaltyDiscount.toLocaleString()} ₽
                    </span>
                  </div>
                  <div className="h-px bg-white/5" />
                </>
              )}

              {appliedPromo && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00d68f] text-xs font-black uppercase flex items-center gap-1">
                      <Tag size={10} /> Промокод
                    </span>
                    <span className="text-[#00d68f] text-sm font-black">
                      −{promoDiscount.toLocaleString()} ₽
                    </span>
                  </div>
                  <div className="h-px bg-white/5" />
                </>
              )}

              <div className="flex justify-between items-center">
                <span className="text-white/40 text-xs font-black uppercase tracking-widest">
                  Итого
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-black text-3xl">
                    {finalPrice.toLocaleString()}
                  </span>
                  <span className="text-[#00d68f] font-black">₽</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className={`w-full py-5 rounded-2xl font-black uppercase text-sm tracking-widest transition-all flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-[#00d68f]/50 cursor-wait text-black"
                    : "bg-[#00d68f] text-black hover:shadow-[0_0_30px_rgba(99,243,247,0.3)] active:scale-95"
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
