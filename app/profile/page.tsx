"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShoppingBag,
  Heart,
  Key,
  LogOut,
  ChevronLeft,
  Shield,
  Gift,
  Copy,
  Check,
  Trophy,
  BarChart3,
  Users,
  Star,
  Gamepad2,
  CreditCard,
  TrendingUp,
  Zap,
} from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  getLoyaltyInfo,
  levelColors,
  levelEmoji,
  type LoyaltyLevel,
} from "@/lib/loyalty";
import Image from "next/image";
const tabs = [
  { id: "profile", label: "Профиль", icon: User },
  { id: "stats", label: "Статистика", icon: BarChart3 },
  { id: "orders", label: "Заказы", icon: ShoppingBag },
  { id: "keys", label: "Ключи", icon: Key },
  { id: "achievements", label: "Достижения", icon: Trophy },
  { id: "bonus", label: "Бонусы", icon: Gift },
  { id: "referral", label: "Друзья", icon: Users },
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
  denomination: number;
  region: string;
}

const ACHIEVEMENTS = [
  {
    id: "first_purchase",
    icon: "🎮",
    title: "Первая покупка",
    desc: "Совершил первый заказ",
    condition: (orders: Order[], spent: number) => orders.length >= 1,
  },
  {
    id: "collector",
    icon: "📦",
    title: "Коллекционер",
    desc: "Купил 5 или более игр",
    condition: (orders: Order[], spent: number) =>
      orders.reduce((s, o) => s + o.items.length, 0) >= 5,
  },
  {
    id: "big_spender",
    icon: "💸",
    title: "Щедрый игрок",
    desc: "Потратил более 5000₽",
    condition: (orders: Order[], spent: number) => spent >= 5000,
  },
  {
    id: "legend",
    icon: "💎",
    title: "Легенда",
    desc: "Достиг уровня Легенда",
    condition: (orders: Order[], spent: number) => spent >= 25000,
  },
  {
    id: "loyal",
    icon: "❤️",
    title: "Верный клиент",
    desc: "Сделал 3 или более заказов",
    condition: (orders: Order[], spent: number) => orders.length >= 3,
  },
  {
    id: "whale",
    icon: "🐋",
    title: "Кит",
    desc: "Потратил более 50000₽",
    condition: (orders: Order[], spent: number) => spent >= 50000,
  },
  {
    id: "fast",
    icon: "⚡",
    title: "Быстрый старт",
    desc: "Купил игру в первый день",
    condition: (orders: Order[], spent: number) => orders.length >= 1,
  },
  {
    id: "variety",
    icon: "🎯",
    title: "Разносторонний",
    desc: "Купил игры разных жанров",
    condition: (orders: Order[], spent: number) => orders.length >= 2,
  },
];

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
  const [activatedId, setActivatedId] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [refLink, setRefLink] = useState("");
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
      if (!session?.user?.email || ordersLoaded) return;
      setLoadingOrders(true);
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", session.user.email)
        .order("created_at", { ascending: false });
      if (data) setOrders(data as Order[]);
      setLoadingOrders(false);
      setOrdersLoaded(true);
    }
    if (
      activeTab === "orders" ||
      activeTab === "stats" ||
      activeTab === "achievements"
    ) {
      loadOrders();
    }
  }, [session, activeTab]);

  useEffect(() => {
    async function loadVouchers() {
      if (!session?.user?.email || activeTab !== "keys") return;
      setLoadingVouchers(true);
      const { data } = await supabase
        .from("vouchers")
        .select("id, code, game_title, created_at, denomination, region")
        .eq("user_email", session.user.email)
        .eq("is_used", true)
        .eq("is_activated", false)
        .order("created_at", { ascending: false });
      if (data) setVouchers(data as Voucher[]);
      setLoadingVouchers(false);
    }
    loadVouchers();
  }, [session, activeTab]);
  useEffect(() => {
    if (session?.user?.email) {
      setRefLink(
        `${window.location.origin}?ref=${session.user.email.split("@")[0]}`,
      );
    }
  }, [session]);
  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleActivate = async (id: string) => {
    setActivatedId(id);
    await supabase.from("vouchers").update({ is_activated: true }).eq("id", id);
    setTimeout(() => {
      setVouchers((prev) => prev.filter((v) => v.id !== id));
      setActivatedId(null);
    }, 1000);
  };

  const handleCopyRef = () => {
    const refLink = `${window.location.origin}?ref=${session?.user?.email?.split("@")[0]}`;
    navigator.clipboard.writeText(refLink);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
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
          className="w-8 h-8 border-2 border-[#ff6b00] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const loyalty = getLoyaltyInfo(totalSpent);
  const levelColor = levelColors[loyalty.level as LoyaltyLevel];
  const levelIcon = levelEmoji[loyalty.level as LoyaltyLevel];

  const totalGames = orders.reduce((s, o) => s + o.items.length, 0);
  const avgOrder =
    orders.length > 0 ? Math.round(totalSpent / orders.length) : 0;
  const unlockedAchievements = ACHIEVEMENTS.filter((a) =>
    a.condition(orders, totalSpent),
  );

  const statusLabel: Record<string, { label: string; color: string }> = {
    pending: { label: "В обработке", color: "#f59e0b" },
    completed: { label: "Выполнен", color: "#ff6b00" },
    cancelled: { label: "Отменён", color: "#ef4444" },
  };

  const getRegionFlag = (region: string) =>
    region === "TR" ? "🇹🇷" : region === "IN" ? "🇮🇳" : "";

  return (
    <main className="relative min-h-screen pt-24 md:pt-32 pb-24">
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-10 overflow-x-hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-[#0a1860]/60 hover:bg-white/[0.08] border border-[#ff6b00]/40 hover:border-[#ff6b00]/30 rounded-2xl transition-all group"
        >
          <ChevronLeft
            size={16}
            className="text-white/40 group-hover:text-[#ff6b00] transition-colors"
          />
          <span className="text-white/40 group-hover:text-[#ff6b00] transition-colors text-xs font-black uppercase  tracking-widest">
            В магазин
          </span>
        </Link>

        <h1 className="text-3xl md:text-5xl font-black  uppercase tracking-tighter mb-6 md:mb-10">
          <span className="text-white">МОЁ </span>
          <span
            className="text-[#ff6b00]"
            style={{ textShadow: "0 0 30px rgba(99,243,247,0.5)" }}
          >
            ПРОСТРАНСТВО
          </span>
        </h1>

        <div className="lg:hidden mb-4">
          <div className="relative bg-[#0a1860]/60 border border-[#ff6b00]/40 rounded-[2rem] p-5 flex items-center gap-4 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#a855f7]/10 to-transparent pointer-events-none" />
            <div className="relative shrink-0">
              {session.user?.image ? (
                <div
                  className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 z-10 relative"
                  style={{ borderColor: levelColor + "60" }}
                >
                  <Image
                    src={session.user.image}
                    alt="avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border-2 z-10 relative"
                  style={{
                    backgroundColor: levelColor + "20",
                    borderColor: levelColor + "40",
                    color: levelColor,
                  }}
                >
                  {session.user?.name?.[0]}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#ff6b00] rounded-full flex items-center justify-center z-20">
                <Shield size={10} className="text-black" />
              </div>
            </div>
            <div className="flex-1 min-w-0 z-10">
              <p className="text-white font-black  truncate">
                {session.user?.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span>{levelIcon}</span>
                <p
                  className="text-[10px] uppercase font-black tracking-widest"
                  style={{ color: levelColor }}
                >
                  {loyalty.level}
                </p>
                <span className="text-white/20 text-[10px] font-black">
                  · Скидка {loyalty.discount}%
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-white/30 text-[9px] font-black">
                  🎮 {totalGames} игр
                </span>
                <span className="text-white/30 text-[9px] font-black">
                  🏆 {unlockedAchievements.length} достижений
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden mb-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 p-1 bg-[#0a1860]/60 border border-[#ff6b00]/40 rounded-2xl w-fit min-w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase  tracking-widest whitespace-nowrap transition-all shrink-0 ${isActive ? "text-black" : "text-white/40"}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-tab-bg"
                      className="absolute inset-0 bg-[#ff6b00] rounded-xl"
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                    />
                  )}
                  <Icon size={13} className="relative z-10 shrink-0" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden lg:flex lg:w-72 shrink-0 flex-col gap-3"
          >
            <div className="relative bg-[#0a1860]/60 border border-[#ff6b00]/40 rounded-[2rem] p-6 flex flex-col items-center gap-4 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#a855f7]/10 to-transparent pointer-events-none" />
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
                className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-transparent via-[#a855f7]/10 to-transparent -skew-x-12 pointer-events-none"
              />
              <div className="relative z-10">
                <div
                  className="absolute inset-0 rounded-full blur-xl"
                  style={{ backgroundColor: levelColor + "40" }}
                />
                {session.user?.image ? (
                  <div
                    className="relative w-20 h-20 rounded-full overflow-hidden border-2 z-10"
                    style={{ borderColor: levelColor + "60" }}
                  >
                    <Image
                      src={session.user.image}
                      alt="avatar"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div
                    className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-2 z-10"
                    style={{
                      backgroundColor: levelColor + "20",
                      borderColor: levelColor + "40",
                      color: levelColor,
                    }}
                  >
                    {session.user?.name?.[0]}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#ff6b00] rounded-full flex items-center justify-center z-20 shadow-[0_0_10px_rgba(99,243,247,0.5)]">
                  <Shield size={13} className="text-black" />
                </div>
              </div>
              <div className="text-center z-10">
                <p className="text-white font-black  text-lg">
                  {session.user?.name}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-1.5">
                  <span className="text-base">{levelIcon}</span>
                  <p
                    className="text-[10px] uppercase font-black tracking-widest"
                    style={{ color: levelColor }}
                  >
                    {loyalty.level}
                  </p>
                </div>
                <p className="text-white/20 text-xs mt-1.5">
                  {session.user?.email}
                </p>
              </div>

              <div className="w-full grid grid-cols-3 gap-2 z-10">
                {[
                  { label: "Игр", value: totalGames, icon: "🎮" },
                  { label: "Заказов", value: orders.length, icon: "📦" },
                  {
                    label: "Достиж.",
                    value: unlockedAchievements.length,
                    icon: "🏆",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center p-2 bg-white/5 rounded-xl"
                  >
                    <span className="text-base">{s.icon}</span>
                    <span className="text-white font-black text-sm">
                      {s.value}
                    </span>
                    <span className="text-white/30 text-[8px] uppercase font-black">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {loyalty.nextLevel && (
                <div className="w-full z-10">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white/20 text-[9px] uppercase font-black tracking-widest">
                      До {loyalty.nextLevel}
                    </span>
                    <span className="text-white/20 text-[9px] font-black">
                      {loyalty.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${loyalty.progress}%` }}
                      transition={{
                        duration: 1.2,
                        ease: "easeOut",
                        delay: 0.5,
                      }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: levelColor }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#0a1860]/60 border border-[#ff6b00]/40 rounded-[2rem] p-3 flex flex-col gap-1">
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
                    className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left overflow-hidden ${isActive ? "text-[#ff6b00]" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="tab-bg"
                        className="absolute inset-0 bg-[#ff6b00]/10 border border-[#ff6b00]/40 rounded-xl"
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 300,
                        }}
                      />
                    )}
                    <Icon size={16} className="relative z-10 shrink-0" />
                    <span className="text-xs font-black uppercase  tracking-widest relative z-10">
                      {tab.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="tab-dot"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ff6b00] relative z-10"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              onClick={() => signOut({ callbackUrl: "/" })}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/25 text-red-500/60 hover:text-red-400 rounded-[2rem] font-black text-xs uppercase  transition-all"
            >
              <LogOut size={14} />
              Выйти из аккаунта
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 bg-[#0a1860]/60 border border-[#ff6b00]/40 rounded-[2rem] p-5 md:p-8 min-h-[400px] overflow-hidden"
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
                  <h3 className="text-white font-black  uppercase text-xl md:text-2xl mb-5 tracking-tight flex items-center gap-3">
                    <User size={20} className="text-[#ff6b00]" /> Мой профиль
                  </h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Имя", value: session.user?.name, icon: "👤" },
                      {
                        label: "Email",
                        value: session.user?.email,
                        icon: "📧",
                      },
                      { label: "Способ входа", value: "Яндекс ID", icon: "🔐" },
                      {
                        label: "Уровень",
                        value: `${levelIcon} ${loyalty.level}`,
                        icon: "⭐",
                      },
                      {
                        label: "Скидка",
                        value: `${loyalty.discount}%`,
                        icon: "🎁",
                      },
                      {
                        label: "Всего куплено игр",
                        value: `${totalGames} шт`,
                        icon: "🎮",
                      },
                      {
                        label: "Разблокировано достижений",
                        value: `${unlockedAchievements.length} из ${ACHIEVEMENTS.length}`,
                        icon: "🏆",
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-4 p-4 bg-[#0a1860]/40 hover:bg-white/[0.04] border border-[#ff6b00]/30 rounded-2xl transition-all"
                      >
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-white/30 text-[10px] uppercase font-black tracking-widest block">
                            {item.label}
                          </span>
                          <span className="text-white font-bold text-sm truncate block mt-0.5">
                            {item.value}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="lg:hidden mt-4 w-full flex items-center justify-center gap-2 py-4 bg-red-500/5 border border-red-500/10 text-red-500/60 rounded-2xl font-black text-xs uppercase  transition-all"
                  >
                    <LogOut size={14} />
                    Выйти из аккаунта
                  </button>
                </motion.div>
              )}

              {activeTab === "stats" && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white font-black  uppercase text-xl md:text-2xl mb-5 tracking-tight flex items-center gap-3">
                    <BarChart3 size={20} className="text-[#ff6b00]" /> Моя
                    статистика
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      {
                        label: "Всего потрачено",
                        value: `${totalSpent.toLocaleString()} ₽`,
                        icon: TrendingUp,
                        color: "#ff6b00",
                      },
                      {
                        label: "Куплено игр",
                        value: totalGames,
                        icon: Gamepad2,
                        color: "#a855f7",
                      },
                      {
                        label: "Заказов",
                        value: orders.length,
                        icon: ShoppingBag,
                        color: "#f59e0b",
                      },
                      {
                        label: "Средний чек",
                        value: `${avgOrder.toLocaleString()} ₽`,
                        icon: CreditCard,
                        color: "#10b981",
                      },
                    ].map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.07 }}
                        className="p-4 bg-[#0a1860]/40 border border-[#ff6b00]/30 rounded-2xl flex flex-col gap-2"
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: s.color + "20" }}
                        >
                          <s.icon size={16} style={{ color: s.color }} />
                        </div>
                        <p className="text-white font-black text-xl">
                          {s.value}
                        </p>
                        <p className="text-white/30 text-[9px] uppercase font-black tracking-widest">
                          {s.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  {orders.length > 0 && (
                    <div>
                      <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-3">
                        Моя коллекция
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {orders
                          .flatMap((o) => o.items)
                          .slice(0, 8)
                          .map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                              className="aspect-square bg-white/5 border border-[#ff6b00]/40 rounded-2xl flex items-center justify-center p-2 relative overflow-hidden group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                              <p className="text-white/50 text-[8px] font-black uppercase  text-center leading-tight">
                                {item.title.split("(")[0].trim()}
                              </p>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  )}
                  {orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 gap-3">
                      <BarChart3 size={32} className="text-white/10" />
                      <p className="text-white/20 text-xs uppercase font-black">
                        Пока нет данных
                      </p>
                    </div>
                  )}
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
                  <h3 className="text-white font-black  uppercase text-xl md:text-2xl mb-5 tracking-tight flex items-center gap-3">
                    <ShoppingBag size={20} className="text-[#ff6b00]" /> Мои
                    заказы
                  </h3>
                  {loadingOrders ? (
                    <div className="flex items-center justify-center h-40">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-6 h-6 border-2 border-[#ff6b00] border-t-transparent rounded-full"
                      />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-4">
                      <ShoppingBag size={40} className="text-white/10" />
                      <p className="text-white/20 text-xs uppercase font-black tracking-widest">
                        Заказов пока нет
                      </p>
                      <Link
                        href="/"
                        className="px-6 py-3 bg-[#ff6b00] text-black text-xs font-black uppercase  rounded-2xl"
                      >
                        В магазин
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {orders.map((order, i) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="p-4 md:p-5 bg-[#0a1860]/40 border border-[#ff6b00]/30 rounded-2xl flex flex-col gap-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/30 text-[9px] uppercase font-black tracking-widest">
                                Заказ
                              </p>
                              <p className="text-white/50 text-xs font-bold mt-0.5">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className="text-[10px] uppercase font-black tracking-widest"
                                style={{
                                  color:
                                    statusLabel[order.status]?.color ||
                                    "#ffffff",
                                }}
                              >
                                {statusLabel[order.status]?.label ||
                                  order.status}
                              </p>
                              <p className="text-white/30 text-[9px] mt-0.5">
                                {new Date(order.created_at).toLocaleDateString(
                                  "ru-RU",
                                  { day: "numeric", month: "long" },
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {order.items.map((item, j) => (
                              <div
                                key={j}
                                className="flex justify-between items-center py-2 border-t border-[#ff6b00]/30"
                              >
                                <span className="text-white/70 text-xs font-bold  truncate max-w-[60%]">
                                  {item.title}
                                </span>
                                <span className="text-[#ff6b00] text-xs font-black">
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}{" "}
                                  ₽
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-[#ff6b00]/40">
                            <span className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                              Итого
                            </span>
                            <span className="text-white font-black text-lg">
                              {Number(order.total_price).toLocaleString()} ₽
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
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
                  <h3 className="text-white font-black  uppercase text-xl md:text-2xl mb-5 tracking-tight flex items-center gap-3">
                    <Key size={20} className="text-[#ff6b00]" /> Мои ключи
                  </h3>
                  {loadingVouchers ? (
                    <div className="flex items-center justify-center h-40">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-6 h-6 border-2 border-[#ff6b00] border-t-transparent rounded-full"
                      />
                    </div>
                  ) : vouchers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-4">
                      <Key size={40} className="text-white/10" />
                      <p className="text-white/20 text-xs uppercase font-black tracking-widest">
                        Ключей пока нет
                      </p>
                      <Link
                        href="/"
                        className="px-6 py-3 bg-[#ff6b00] text-black text-xs font-black uppercase  rounded-2xl"
                      >
                        В магазин
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {vouchers.map((voucher, i) => (
                        <motion.div
                          key={voucher.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="p-4 bg-[#0a1860]/40 border border-[#ff6b00]/30 hover:border-[#ff6b00]/40 rounded-2xl flex items-center justify-between gap-3 group transition-all"
                        >
                          <div className="flex flex-col gap-1 min-w-0">
                            <p className="text-white/30 text-[9px] uppercase font-black tracking-widest truncate">
                              {voucher.game_title || "PSN карта"}
                            </p>
                            <p className="text-[#ff6b00] font-black text-sm tracking-widest font-mono truncate">
                              {voucher.code}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {voucher.denomination > 0 && (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-[#ff6b00]/10 border border-[#ff6b00]/40 rounded-lg">
                                  <CreditCard
                                    size={9}
                                    className="text-[#ff6b00]"
                                  />
                                  <span className="text-[#ff6b00] text-[9px] font-black">
                                    PSN {voucher.denomination.toLocaleString()}{" "}
                                    ₽
                                  </span>
                                </div>
                              )}
                              <span className="text-[10px]">
                                {getRegionFlag(voucher.region)}
                              </span>
                              <p className="text-white/20 text-[9px]">
                                {new Date(
                                  voucher.created_at,
                                ).toLocaleDateString("ru-RU", {
                                  day: "numeric",
                                  month: "long",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <motion.button
                              onClick={() => handleActivate(voucher.id)}
                              whileTap={{ scale: 0.9 }}
                              className={`px-3 py-2 rounded-xl border transition-all text-[10px] font-black uppercase ${
                                activatedId === voucher.id
                                  ? "bg-green-500/20 border-green-500/40 text-green-400"
                                  : "bg-[#0a1860]/60 border-[#ff6b00]/40 text-white/30 hover:text-green-400 hover:border-green-400/30"
                              }`}
                            >
                              {activatedId === voucher.id
                                ? "✓ Готово"
                                : "Активировал"}
                            </motion.button>
                            <motion.button
                              onClick={() =>
                                handleCopy(voucher.id, voucher.code)
                              }
                              whileTap={{ scale: 0.9 }}
                              className={`p-3 rounded-xl border transition-all ${copiedId === voucher.id ? "bg-[#ff6b00]/10 border-[#ff6b00]/30 text-[#ff6b00]" : "bg-[#0a1860]/60 border-[#ff6b00]/40 text-white/30 hover:text-white"}`}
                            >
                              {copiedId === voucher.id ? (
                                <Check size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "achievements" && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white font-black  uppercase text-xl md:text-2xl mb-2 tracking-tight flex items-center gap-3">
                    <Trophy size={20} className="text-[#ff6b00]" /> Достижения
                  </h3>
                  <p className="text-white/30 text-xs mb-5">
                    {unlockedAchievements.length} из {ACHIEVEMENTS.length}{" "}
                    разблокировано
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ACHIEVEMENTS.map((ach, i) => {
                      const unlocked = ach.condition(orders, totalSpent);
                      return (
                        <motion.div
                          key={ach.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.06 }}
                          className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${unlocked ? "border-[#ff6b00]/40 bg-[#ff6b00]/5" : "border-[#ff6b00]/30 bg-white/[0.01] opacity-40"}`}
                        >
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${unlocked ? "bg-[#ff6b00]/10" : "bg-white/5"}`}
                          >
                            {unlocked ? ach.icon : "🔒"}
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`font-black text-sm uppercase  ${unlocked ? "text-white" : "text-white/30"}`}
                            >
                              {ach.title}
                            </p>
                            <p className="text-white/30 text-[10px] mt-0.5">
                              {ach.desc}
                            </p>
                          </div>
                          {unlocked && (
                            <div className="ml-auto shrink-0">
                              <div className="w-6 h-6 rounded-full bg-[#ff6b00] flex items-center justify-center">
                                <Check size={12} className="text-black" />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
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
                  <h3 className="text-white font-black  uppercase text-xl md:text-2xl mb-5 tracking-tight flex items-center gap-3">
                    <Gift size={20} className="text-[#ff6b00]" /> Программа
                    лояльности
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div
                      className="relative p-5 rounded-2xl overflow-hidden border"
                      style={{
                        borderColor: levelColor + "30",
                        background: levelColor + "08",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-4xl"
                        >
                          {levelIcon}
                        </motion.div>
                        <div>
                          <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-0.5">
                            Текущий уровень
                          </p>
                          <p
                            className="font-black  uppercase text-2xl"
                            style={{ color: levelColor }}
                          >
                            {loyalty.level}
                          </p>
                          <p className="text-white/50 text-xs mt-0.5">
                            Скидка{" "}
                            <span
                              className="font-black"
                              style={{ color: levelColor }}
                            >
                              {loyalty.discount}%
                            </span>{" "}
                            на все покупки
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-[#0a1860]/40 border border-[#ff6b00]/30 rounded-2xl">
                        <p className="text-white/30 text-[9px] uppercase font-black tracking-widest mb-1">
                          Потрачено
                        </p>
                        <p className="text-white font-black text-lg">
                          {totalSpent.toLocaleString()} ₽
                        </p>
                      </div>
                      {loyalty.nextLevel && (
                        <div className="p-4 bg-[#0a1860]/40 border border-[#ff6b00]/30 rounded-2xl">
                          <p className="text-white/30 text-[9px] uppercase font-black tracking-widest mb-1">
                            До {loyalty.nextLevel}
                          </p>
                          <p className="text-white font-black text-lg">
                            {(
                              loyalty.nextLevelThreshold - totalSpent
                            ).toLocaleString()}{" "}
                            ₽
                          </p>
                        </div>
                      )}
                    </div>
                    {loyalty.nextLevel && (
                      <div className="p-4 bg-[#0a1860]/40 border border-[#ff6b00]/30 rounded-2xl flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                            Прогресс до {loyalty.nextLevel}
                          </span>
                          <span className="text-white/50 text-xs font-black">
                            {loyalty.progress}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${loyalty.progress}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: levelColor }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                        Все уровни
                      </p>
                      {[
                        {
                          level: "Новичок",
                          threshold: "0 ₽",
                          discount: "0%",
                          emoji: "🥉",
                        },
                        {
                          level: "Игрок",
                          threshold: "3 000 ₽",
                          discount: "3%",
                          emoji: "🥈",
                        },
                        {
                          level: "Про",
                          threshold: "10 000 ₽",
                          discount: "7%",
                          emoji: "🥇",
                        },
                        {
                          level: "Легенда",
                          threshold: "25 000 ₽",
                          discount: "15%",
                          emoji: "💎",
                        },
                      ].map((l) => (
                        <div
                          key={l.level}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${loyalty.level === l.level ? "border-white/20 bg-white/[0.05]" : "border-[#ff6b00]/30 bg-white/[0.01]"}`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{l.emoji}</span>
                            <span
                              className={`text-xs font-black uppercase  ${loyalty.level === l.level ? "text-white" : "text-white/30"}`}
                            >
                              {l.level}
                            </span>
                            {loyalty.level === l.level && (
                              <span className="text-[8px] bg-[#ff6b00]/10 border border-[#ff6b00]/40 text-[#ff6b00] px-1.5 py-0.5 rounded-lg font-black uppercase">
                                текущий
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-white/20 text-[10px] font-black hidden sm:block">
                              от {l.threshold}
                            </span>
                            <span
                              className={`text-xs font-black ${loyalty.level === l.level ? "text-[#ff6b00]" : "text-white/20"}`}
                            >
                              −{l.discount}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "referral" && (
                <motion.div
                  key="referral"
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white font-black  uppercase text-xl md:text-2xl mb-5 tracking-tight flex items-center gap-3">
                    <Users size={20} className="text-[#ff6b00]" /> Пригласи
                    друга
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="relative p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-[#ff6b00]/10 to-[#a855f7]/10 border border-[#ff6b00]/40">
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none"
                      />
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">🎁</span>
                        <div>
                          <p className="text-white font-black  uppercase text-lg">
                            Приведи друга
                          </p>
                          <p className="text-white/50 text-xs">
                            и получи бонус на следующую покупку
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-[#ff6b00]" />
                        <span className="text-[#ff6b00] text-xs font-black">
                          Скоро: реферальные бонусы будут активированы
                        </span>
                      </div>
                    </div>
                    <div className="p-5 bg-[#0a1860]/40 border border-[#ff6b00]/30 rounded-2xl flex flex-col gap-3">
                      <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                        Твоя реферальная ссылка
                      </p>
                      <div className="flex gap-2">
                        <div className="flex-1 px-4 py-3 bg-white/5 border border-[#ff6b00]/40 rounded-2xl font-mono text-xs text-white/50 truncate">
                          {refLink}
                        </div>
                        <motion.button
                          onClick={handleCopyRef}
                          whileTap={{ scale: 0.9 }}
                          className={`px-4 py-3 rounded-2xl border font-black text-xs uppercase transition-all ${copiedRef ? "bg-[#ff6b00]/10 border-[#ff6b00]/30 text-[#ff6b00]" : "bg-white/5 border-[#ff6b00]/40 text-white/40 hover:text-white"}`}
                        >
                          {copiedRef ? <Check size={16} /> : <Copy size={16} />}
                        </motion.button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                        Как работает
                      </p>
                      {[
                        {
                          step: "1",
                          text: "Поделись своей ссылкой с другом",
                          icon: "🔗",
                        },
                        {
                          step: "2",
                          text: "Друг регистрируется и делает первую покупку",
                          icon: "🛒",
                        },
                        {
                          step: "3",
                          text: "Ты получаешь бонусную скидку на следующий заказ",
                          icon: "🎁",
                        },
                      ].map((item, i) => (
                        <motion.div
                          key={item.step}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-[#0a1860]/40 border border-[#ff6b00]/30 rounded-2xl"
                        >
                          <div className="w-8 h-8 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/40 flex items-center justify-center shrink-0">
                            <span className="text-[#ff6b00] text-xs font-black">
                              {item.step}
                            </span>
                          </div>
                          <span className="text-lg">{item.icon}</span>
                          <p className="text-white/50 text-xs font-bold">
                            {item.text}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-4 bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-[#f59e0b]" />
                        <p className="text-[#f59e0b] text-xs font-black">
                          Функция в разработке — скоро запустим!
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
