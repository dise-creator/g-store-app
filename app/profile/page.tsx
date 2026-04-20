"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingBag, Heart, Key, LogOut, ChevronLeft, Shield, Gift, Copy, Check, Sparkles } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-[#63f3f7] border-t-transparent rounded-full"
        />
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
    <main className="relative min-h-screen pt-32 pb-24 overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">

        {/* Кнопка назад */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 mb-10 px-5 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#63f3f7]/30 rounded-2xl transition-all group"
          >
            <ChevronLeft size={20} className="text-white/40 group-hover:text-[#63f3f7] transition-colors group-hover:-translate-x-0.5 duration-200" />
            <span className="text-white/40 group-hover:text-[#63f3f7] transition-colors text-sm font-black uppercase italic tracking-widest">
              Вернуться в магазин
            </span>
          </Link>
        </motion.div>

        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
            <span className="text-white">МОЁ </span>
            <span className="text-[#63f3f7]" style={{ textShadow: "0 0 30px rgba(99,243,247,0.5)" }}>ПРОСТРАНСТВО</span>
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Левая колонка */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:w-72 shrink-0 flex flex-col gap-3"
          >
            {/* Карточка профиля */}
            <div className="relative bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 flex flex-col items-center gap-4 overflow-hidden">
              {/* Декоративный градиент */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#a855f7]/10 to-transparent pointer-events-none" />
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-transparent via-[#a855f7]/10 to-transparent -skew-x-12 pointer-events-none"
              />

              {/* Аватар */}
              <div className="relative z-10">
                <div className="absolute inset-0 rounded-full blur-xl" style={{ backgroundColor: levelColor + "40" }} />
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    className="relative w-20 h-20 rounded-full border-2 z-10"
                    style={{ borderColor: levelColor + "60" }}
                    alt="avatar"
                  />
                ) : (
                  <div
                    className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-2 z-10"
                    style={{ backgroundColor: levelColor + "20", borderColor: levelColor + "40", color: levelColor }}
                  >
                    {session.user?.name?.[0]}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#63f3f7] rounded-full flex items-center justify-center z-20 shadow-[0_0_10px_rgba(99,243,247,0.5)]">
                  <Shield size={13} className="text-black" />
                </div>
              </div>

              {/* Инфо */}
              <div className="text-center z-10">
                <p className="text-white font-black italic text-lg">{session.user?.name}</p>
                <div className="flex items-center justify-center gap-1.5 mt-1.5">
                  <span className="text-base">{levelIcon}</span>
                  <p className="text-[10px] uppercase font-black tracking-widest" style={{ color: levelColor }}>
                    {loyalty.level}
                  </p>
                </div>
                <p className="text-white/20 text-xs mt-1.5">{session.user?.email}</p>
              </div>

              {/* Прогресс лояльности */}
              {loyalty.nextLevel && (
                <div className="w-full z-10">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white/20 text-[9px] uppercase font-black tracking-widest">До {loyalty.nextLevel}</span>
                    <span className="text-white/20 text-[9px] font-black">{loyalty.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${loyalty.progress}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: levelColor }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Табы */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-3 flex flex-col gap-1">
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left overflow-hidden ${
                      isActive
                        ? "text-[#63f3f7]"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="tab-bg"
                        className="absolute inset-0 bg-[#63f3f7]/10 border border-[#63f3f7]/20 rounded-xl"
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      />
                    )}
                    <Icon size={16} className="relative z-10 shrink-0" />
                    <span className="text-xs font-black uppercase italic tracking-widest relative z-10">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="tab-dot"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[#63f3f7] relative z-10"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Кнопка выхода */}
            <motion.button
              onClick={() => signOut({ callbackUrl: "/" })}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/25 text-red-500/60 hover:text-red-400 rounded-[2rem] font-black text-xs uppercase italic transition-all"
            >
              <LogOut size={14} />
              Выйти из аккаунта
            </motion.button>
          </motion.div>

          {/* Правая часть */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 min-h-[500px] overflow-hidden"
          >
            <AnimatePresence mode="wait">

              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white font-black italic uppercase text-2xl mb-6 tracking-tight flex items-center gap-3">
                    <User size={20} className="text-[#63f3f7]" /> Мой профиль
                  </h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Имя", value: session.user?.name, icon: "👤" },
                      { label: "Email", value: session.user?.email, icon: "📧" },
                      { label: "Способ входа", value: "Яндекс ID", icon: "🔐" },
                      { label: "Уровень", value: `${levelIcon} ${loyalty.level}`, icon: "⭐" },
                      { label: "Скидка", value: `${loyalty.discount}%`, icon: "🎁" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-4 p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl transition-all group"
                      >
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-white/30 text-[10px] uppercase font-black tracking-widest block">{item.label}</span>
                          <span className="text-white font-bold text-sm truncate block mt-0.5">{item.value}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white font-black italic uppercase text-2xl mb-6 tracking-tight flex items-center gap-3">
                    <ShoppingBag size={20} className="text-[#63f3f7]" /> Мои заказы
                  </h3>
                  {loadingOrders ? (
                    <div className="flex items-center justify-center h-40">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-[#63f3f7] border-t-transparent rounded-full"
                      />
                    </div>
                  ) : orders.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center h-64 gap-4"
                    >
                      <ShoppingBag size={40} className="text-white/10" />
                      <p className="text-white/20 text-xs uppercase font-black tracking-widest">Заказов пока нет</p>
                      <Link href="/" className="px-6 py-3 bg-[#63f3f7] text-black text-xs font-black uppercase italic rounded-2xl hover:shadow-[0_0_20px_rgba(99,243,247,0.3)] transition-all">
                        Перейти в магазин
                      </Link>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {orders.map((order, i) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="p-5 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl flex flex-col gap-4 transition-all"
                        >
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
                            {order.items.map((item, j) => (
                              <div key={j} className="flex justify-between items-center py-2 border-t border-white/5">
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
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "wishlist" && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center h-64 gap-4"
                >
                  <Heart size={40} className="text-white/10" />
                  <p className="text-white/20 text-xs uppercase font-black tracking-widest">Список пуст</p>
                  <Link href="/wishlist" className="px-6 py-3 bg-[#63f3f7] text-black text-xs font-black uppercase italic rounded-2xl hover:shadow-[0_0_20px_rgba(99,243,247,0.3)] transition-all">
                    Перейти к избранному
                  </Link>
                </motion.div>
              )}

              {activeTab === "keys" && (
                <motion.div
                  key="keys"
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white font-black italic uppercase text-2xl mb-6 tracking-tight flex items-center gap-3">
                    <Key size={20} className="text-[#63f3f7]" /> Мои ключи
                  </h3>
                  {loadingVouchers ? (
                    <div className="flex items-center justify-center h-40">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-[#63f3f7] border-t-transparent rounded-full"
                      />
                    </div>
                  ) : vouchers.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center h-64 gap-4"
                    >
                      <Key size={40} className="text-white/10" />
                      <p className="text-white/20 text-xs uppercase font-black tracking-widest">Ключей пока нет</p>
                      <Link href="/" className="px-6 py-3 bg-[#63f3f7] text-black text-xs font-black uppercase italic rounded-2xl hover:shadow-[0_0_20px_rgba(99,243,247,0.3)] transition-all">
                        Перейти в магазин
                      </Link>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {vouchers.map((voucher, i) => (
                        <motion.div
                          key={voucher.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="p-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-[#63f3f7]/20 rounded-2xl flex items-center justify-between gap-4 transition-all group"
                        >
                          <div className="flex flex-col gap-1 min-w-0">
                            <p className="text-white/30 text-[9px] uppercase font-black tracking-widest truncate">
                              {voucher.game_title || "Игра"}
                            </p>
                            <p className="text-[#63f3f7] font-black text-sm tracking-widest font-mono group-hover:drop-shadow-[0_0_8px_rgba(99,243,247,0.5)] transition-all">
                              {voucher.code}
                            </p>
                            <p className="text-white/20 text-[9px] mt-0.5">
                              {new Date(voucher.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          </div>
                          <motion.button
                            onClick={() => handleCopy(voucher.id, voucher.code)}
                            whileTap={{ scale: 0.9 }}
                            className={`shrink-0 p-3 rounded-xl border transition-all ${
                              copiedId === voucher.id
                                ? "bg-[#63f3f7]/10 border-[#63f3f7]/30 text-[#63f3f7] shadow-[0_0_15px_rgba(99,243,247,0.2)]"
                                : "bg-white/[0.03] border-white/10 text-white/30 hover:text-white hover:border-white/20"
                            }`}
                          >
                            <AnimatePresence mode="wait">
                              {copiedId === voucher.id ? (
                                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <Check size={16} />
                                </motion.div>
                              ) : (
                                <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <Copy size={16} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "bonus" && (
                <motion.div
                  key="bonus"
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white font-black italic uppercase text-2xl mb-6 tracking-tight flex items-center gap-3">
                    <Gift size={20} className="text-[#63f3f7]" /> Программа лояльности
                  </h3>
                  {loadingLoyalty ? (
                    <div className="flex items-center justify-center h-40">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-[#63f3f7] border-t-transparent rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {/* Текущий уровень */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative p-6 rounded-2xl overflow-hidden border"
                        style={{ borderColor: levelColor + "30", background: levelColor + "08" }}
                      >
                        <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(ellipse at 80% 50%, ${levelColor}, transparent 70%)` }} />
                        <div className="relative flex items-center gap-5">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-5xl"
                          >
                            {levelIcon}
                          </motion.div>
                          <div>
                            <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Текущий уровень</p>
                            <p className="font-black italic uppercase text-3xl" style={{ color: levelColor }}>{loyalty.level}</p>
                            <p className="text-white/50 text-xs mt-1 font-bold">
                              Скидка: <span className="font-black" style={{ color: levelColor }}>{loyalty.discount}%</span>
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Потрачено */}
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center">
                        <span className="text-white/30 text-[10px] uppercase font-black tracking-widest">Всего потрачено</span>
                        <span className="text-white font-black text-lg">{totalSpent.toLocaleString("ru-RU")} ₽</span>
                      </div>

                      {/* Прогресс */}
                      {loyalty.nextLevel && (
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                              До уровня {levelEmoji[loyalty.nextLevel as LoyaltyLevel]} {loyalty.nextLevel}
                            </span>
                            <span className="text-white/50 text-xs font-black">{(loyalty.nextLevelThreshold - totalSpent).toLocaleString("ru-RU")} ₽</span>
                          </div>
                          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${loyalty.progress}%` }}
                              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                              className="h-full rounded-full relative overflow-hidden"
                              style={{ backgroundColor: levelColor }}
                            >
                              <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              />
                            </motion.div>
                          </div>
                          <p className="text-white/20 text-[10px] font-black">{loyalty.progress}% выполнено</p>
                        </div>
                      )}

                      {/* Все уровни */}
                      <div className="flex flex-col gap-2">
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Все уровни</p>
                        {[
                          { level: "Новичок", threshold: "0 ₽", discount: "0%", emoji: "🥉" },
                          { level: "Игрок", threshold: "3 000 ₽", discount: "3%", emoji: "🥈" },
                          { level: "Про", threshold: "10 000 ₽", discount: "7%", emoji: "🥇" },
                          { level: "Легенда", threshold: "25 000 ₽", discount: "15%", emoji: "💎" },
                        ].map((l, i) => (
                          <motion.div
                            key={l.level}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.07 }}
                            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                              loyalty.level === l.level
                                ? "border-white/20 bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{l.emoji}</span>
                              <span className={`text-xs font-black uppercase italic ${loyalty.level === l.level ? "text-white" : "text-white/30"}`}>
                                {l.level}
                              </span>
                              {loyalty.level === l.level && (
                                <span className="text-[8px] bg-[#63f3f7]/10 border border-[#63f3f7]/20 text-[#63f3f7] px-2 py-0.5 rounded-lg font-black uppercase">
                                  текущий
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-white/20 text-[10px] font-black">от {l.threshold}</span>
                              <span className={`text-xs font-black ${loyalty.level === l.level ? "text-[#63f3f7]" : "text-white/20"}`}>
                                −{l.discount}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}