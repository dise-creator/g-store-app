"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, ShoppingBag, Heart, Key, LogOut, ChevronLeft, Shield, Gift, Copy, Check } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getLoyaltyInfo, levelColors, levelEmoji, type LoyaltyLevel } from "@/lib/loyalty";

const tabs = [
  { id: "profile", label: "Профиль", icon: User },
  { id: "orders", label: "Заказы", icon: ShoppingBag },
  { id: "wishlist", label: "Избранное", icon: Heart },
  { id: "keys", label: "Мои ключи", icon: Key },
  { id: "bonus", label: "Бонусы", icon: Gift },
];

interface Order {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  items: { game_id: string; title: string; price: number; quantity: number }[];
}

// Тип для ключа
interface Voucher {
  id: string;
  code: string;
  game_title: string;
  created_at: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [totalSpent, setTotalSpent] = useState(0);
  const [loadingLoyalty, setLoadingLoyalty] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Ключи
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      if (!session?.user?.email) return;
      const { data } = await supabase
        .from("users")
        .select("total_spent")
        .eq("email", session.user.email)
        .single();
      if (data) setTotalSpent(Number(data.total_spent) || 0);
      setLoadingLoyalty(false);
    }
    loadUserData();
  }, [session]);

  useEffect(() => {
    async function loadOrders() {
      if (!session?.user?.email || activeTab !== "orders") return;
      setLoadingOrders(true);
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", session.user.email)
        .order("created_at", { ascending: false });
      if (data) setOrders(data as Order[]);
      setLoadingOrders(false);
    }
    loadOrders();
  }, [session, activeTab]);

  // Загружаем ключи когда переходим на вкладку
  useEffect(() => {
    async function loadVouchers() {
      if (!session?.user?.email || activeTab !== "keys") return;
      setLoadingVouchers(true);
      const { data } = await supabase
        .from("vouchers")
        .select("id, code, game_title, created_at")
        .eq("user_email", session.user.email)
        .eq("is_used", true)
        .order("created_at", { ascending: false });
      if (data) setVouchers(data as Voucher[]);
      setLoadingVouchers(false);
    }
    loadVouchers();
  }, [session, activeTab]);

  // Копирование ключа в буфер обмена
  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (status === "unauthenticated") {
    router.push("/signin");
    return null;
  }

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#63f3f7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const loyalty = getLoyaltyInfo(totalSpent);
  const levelColor = levelColors[loyalty.level as LoyaltyLevel];
  const levelIcon = levelEmoji[loyalty.level as LoyaltyLevel];

  const statusLabel: Record<string, { label: string; color: string }> = {
    pending: { label: "В обработке", color: "#f59e0b" },
    completed: { label: "Выполнен", color: "#63f3f7" },
    cancelled: { label: "Отменён", color: "#ef4444" },
  };

  return (
    <main className="relative min-h-screen bg-[#050507] pt-32 pb-24 overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">

        <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#63f3f7] transition-colors mb-10 text-xs uppercase font-black italic tracking-widest">
          <ChevronLeft size={16} />
          Вернуться в магазин
        </Link>

        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">
            <span className="text-white">ЛИЧ</span>
            <span className="text-[#63f3f7]" style={{ textShadow: "0 0 40px rgba(99,243,247,0.5)" }}>НЫЙ</span>
          </h1>
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white">
            КАБИНЕТ
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          <div className="lg:w-72 shrink-0 flex flex-col gap-3">

            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 flex flex-col items-center gap-4">
              <div className="relative">
                {session.user?.image ? (
                  <img src={session.user.image} className="w-20 h-20 rounded-full border-2 border-[#63f3f7]/30" alt="avatar" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#a855f7]/20 border-2 border-[#a855f7]/30 flex items-center justify-center text-3xl font-black text-[#a855f7]">
                    {session.user?.name?.[0]}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#63f3f7] rounded-full flex items-center justify-center">
                  <Shield size={12} className="text-black" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-black italic text-lg">{session.user?.name}</p>
                <p className="text-[10px] uppercase font-black tracking-widest mt-1" style={{ color: levelColor }}>
                  {levelIcon} {loyalty.level}
                </p>
                <p className="text-white/30 text-xs mt-1">{session.user?.email}</p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-3 flex flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      isActive
                        ? "bg-[#63f3f7]/10 border border-[#63f3f7]/20 text-[#63f3f7]"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-xs font-black uppercase italic tracking-widest">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-500 rounded-[2rem] font-black text-xs uppercase italic transition-all"
            >
              <LogOut size={14} />
              Выйти из аккаунта
            </button>
          </div>

          <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 min-h-[500px]">

            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-white font-black italic uppercase text-2xl mb-6 tracking-tight">Мой профиль</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Имя", value: session.user?.name },
                    { label: "Email", value: session.user?.email },
                    { label: "Способ входа", value: "Яндекс ID" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-1 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <span className="text-white/30 text-[10px] uppercase font-black tracking-widest">{item.label}</span>
                      <span className="text-white font-bold text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-white font-black italic uppercase text-2xl mb-6 tracking-tight">Мои заказы</h3>
                {loadingOrders ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="w-6 h-6 border-2 border-[#63f3f7] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <ShoppingBag size={40} className="text-white/10" />
                    <p className="text-white/20 text-xs uppercase font-black tracking-widest">Заказов пока нет</p>
                    <Link href="/" className="px-6 py-3 bg-[#63f3f7] text-black text-xs font-black uppercase italic rounded-2xl">
                      Перейти в магазин
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/30 text-[9px] uppercase font-black tracking-widest">Заказ</p>
                            <p className="text-white/50 text-xs font-bold mt-0.5">#{order.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase font-black tracking-widest" style={{ color: statusLabel[order.status]?.color || "#ffffff" }}>
                              {statusLabel[order.status]?.label || order.status}
                            </p>
                            <p className="text-white/30 text-[9px] mt-0.5">
                              {new Date(order.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-t border-white/5">
                              <span className="text-white/70 text-xs font-bold italic">{item.title}</span>
                              <div className="flex items-center gap-3">
                                {item.quantity > 1 && <span className="text-white/30 text-[10px]">×{item.quantity}</span>}
                                <span className="text-[#63f3f7] text-xs font-black">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                          <span className="text-white/30 text-[10px] uppercase font-black tracking-widest">Итого</span>
                          <span className="text-white font-black text-lg">{Number(order.total_price).toLocaleString("ru-RU")} ₽</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "wishlist" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-64 gap-4">
                <Heart size={40} className="text-white/10" />
                <p className="text-white/20 text-xs uppercase font-black tracking-widest">Список пуст</p>
                <Link href="/" className="px-6 py-3 bg-[#63f3f7] text-black text-xs font-black uppercase italic rounded-2xl">
                  Перейти к покупкам
                </Link>
              </motion.div>
            )}

            {/* Вкладка ключей — теперь с реальными данными */}
            {activeTab === "keys" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-white font-black italic uppercase text-2xl mb-6 tracking-tight">Мои ключи</h3>
                {loadingVouchers ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="w-6 h-6 border-2 border-[#63f3f7] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : vouchers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Key size={40} className="text-white/10" />
                    <p className="text-white/20 text-xs uppercase font-black tracking-widest">Ключей пока нет</p>
                    <Link href="/" className="px-6 py-3 bg-[#63f3f7] text-black text-xs font-black uppercase italic rounded-2xl">
                      Перейти в магазин
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {vouchers.map((voucher) => (
                      <div key={voucher.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-white/30 text-[9px] uppercase font-black tracking-widest">
                            {voucher.game_title || "Игра"}
                          </p>
                          {/* Ключ в стиле лицензионного кода */}
                          <p className="text-[#63f3f7] font-black text-sm tracking-widest font-mono">
                            {voucher.code}
                          </p>
                          <p className="text-white/20 text-[9px] mt-1">
                            {new Date(voucher.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>

                        {/* Кнопка копирования */}
                        <button
                          onClick={() => handleCopy(voucher.id, voucher.code)}
                          className={`shrink-0 p-3 rounded-xl border transition-all ${
                            copiedId === voucher.id
                              ? "bg-[#63f3f7]/10 border-[#63f3f7]/30 text-[#63f3f7]"
                              : "bg-white/[0.03] border-white/10 text-white/30 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {copiedId === voucher.id ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "bonus" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-white font-black italic uppercase text-2xl mb-6 tracking-tight">Программа лояльности</h3>
                {loadingLoyalty ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="w-6 h-6 border-2 border-[#63f3f7] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-6">
                      <div className="text-6xl">{levelIcon}</div>
                      <div>
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Текущий уровень</p>
                        <p className="font-black italic uppercase text-3xl" style={{ color: levelColor }}>{loyalty.level}</p>
                        <p className="text-white/50 text-xs mt-1 font-bold">Скидка на все покупки: <span className="text-white font-black">{loyalty.discount}%</span></p>
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center">
                      <span className="text-white/30 text-[10px] uppercase font-black tracking-widest">Всего потрачено</span>
                      <span className="text-white font-black text-lg">{totalSpent.toLocaleString("ru-RU")} ₽</span>
                    </div>
                    {loyalty.nextLevel && (
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white/30 text-[10px] uppercase font-black tracking-widest">До уровня {levelEmoji[loyalty.nextLevel as LoyaltyLevel]} {loyalty.nextLevel}</span>
                          <span className="text-white/50 text-xs font-black">{(loyalty.nextLevelThreshold - totalSpent).toLocaleString("ru-RU")} ₽</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${loyalty.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: levelColor }}
                          />
                        </div>
                        <p className="text-white/20 text-[10px] font-black">{loyalty.progress}% выполнено</p>
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-2">Все уровни</p>
                      {[
                        { level: "Новичок", threshold: "0 ₽", discount: "0%", emoji: "🥉" },
                        { level: "Игрок", threshold: "3 000 ₽", discount: "3%", emoji: "🥈" },
                        { level: "Про", threshold: "10 000 ₽", discount: "7%", emoji: "🥇" },
                        { level: "Легенда", threshold: "25 000 ₽", discount: "15%", emoji: "💎" },
                      ].map((l) => (
                        <div
                          key={l.level}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                            loyalty.level === l.level ? "border-white/20 bg-white/[0.05]" : "border-white/5 bg-white/[0.01]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{l.emoji}</span>
                            <span className={`text-xs font-black uppercase italic ${loyalty.level === l.level ? "text-white" : "text-white/30"}`}>{l.level}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-white/20 text-[10px] font-black">от {l.threshold}</span>
                            <span className={`text-xs font-black ${loyalty.level === l.level ? "text-[#63f3f7]" : "text-white/20"}`}>−{l.discount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}