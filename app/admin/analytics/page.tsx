"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ChevronLeft, TrendingUp, ShoppingBag, Tag, Zap, ShieldX } from "lucide-react";
import Link from "next/link";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Order {
  id: string;
  total_price: number;
  created_at: string;
  user_email: string;
  items: { title: string; quantity: number; price: number }[];
  promo_discount: number | null;
}

interface PromoCode {
  id: string;
  code: string;
  type: string;
  value: number;
  used_count: number;
  max_uses: number;
  is_active: boolean;
}

interface DayStat {
  date: string;
  revenue: number;
  orders: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin) router.push("/");
  }, [isAdmin, adminLoading]);

  useEffect(() => {
    if (!isAdmin) return;
    async function load() {
      setLoading(true);
      const [{ data: ordersData }, { data: promosData }] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("promo_codes").select("*").order("created_at", { ascending: false }),
      ]);
      setOrders(ordersData || []);
      setPromos(promosData || []);
      setLoading(false);
    }
    load();
  }, [isAdmin]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const totalPromoDiscount = orders.reduce((sum, o) => sum + (o.promo_discount || 0), 0);

  const chartData: DayStat[] = (() => {
    const days: Record<string, DayStat> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
      days[key] = { date: key, revenue: 0, orders: 0 };
    }
    orders.forEach((o) => {
      const key = new Date(o.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
      if (days[key]) {
        days[key].revenue += o.total_price || 0;
        days[key].orders += 1;
      }
    });
    return Object.values(days);
  })();

  const gameStats: Record<string, { title: string; count: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      if (!gameStats[item.title]) {
        gameStats[item.title] = { title: item.title, count: 0, revenue: 0 };
      }
      gameStats[item.title].count += item.quantity || 1;
      gameStats[item.title].revenue += item.price * (item.quantity || 1);
    });
  });
  const topGames = Object.values(gameStats).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const cards = [
    { label: "Общая выручка", value: `${totalRevenue.toLocaleString()} ₽`, icon: TrendingUp },
    { label: "Заказов", value: totalOrders, icon: ShoppingBag },
    { label: "Средний чек", value: `${avgOrder.toLocaleString()} ₽`, icon: Zap },
    { label: "Скидок по промо", value: `${totalPromoDiscount.toLocaleString()} ₽`, icon: Tag },
  ];

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#63f3f7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ShieldX size={48} className="text-red-400" />
        <p className="text-white/30 font-black uppercase text-xl">Нет доступа</p>
        <Link href="/" className="px-6 py-3 bg-[#63f3f7] text-black font-black uppercase text-xs rounded-2xl">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-10 pb-20 px-8">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#63f3f7] transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase text-white tracking-tighter">
              Анали<span className="text-[#63f3f7]">тика</span>
            </h1>
            <p className="text-white/30 text-xs mt-1">Статистика продаж и промокодов</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#63f3f7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {cards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#63f3f7]/10 border border-[#63f3f7]/20 flex items-center justify-center">
                      <card.icon size={15} className="text-[#63f3f7]" />
                    </div>
                    <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">{card.label}</p>
                  </div>
                  <p className="text-white font-black text-2xl">{card.value}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6"
            >
              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-6">
                Выручка за последние 14 дней
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#63f3f7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#63f3f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", color: "white" }}
               formatter={(val) => [`${Number(val).toLocaleString()} ₽`, "Выручка"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#63f3f7" strokeWidth={2} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6"
              >
                <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-4">Топ игр по выручке</p>
                {topGames.length === 0 ? (
                  <p className="text-white/20 text-xs font-black uppercase text-center py-8">Нет данных</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {topGames.map((g, i) => (
                      <div key={g.title} className="flex items-center gap-3">
                        <span className="text-[#63f3f7] font-black text-sm w-5">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/70 text-xs font-black uppercase truncate">{g.title}</p>
                          <p className="text-white/20 text-[10px]">{g.count} шт</p>
                        </div>
                        <p className="text-[#63f3f7] font-black text-sm shrink-0">{g.revenue.toLocaleString()} ₽</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6"
              >
                <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-4">Статистика промокодов</p>
                {promos.length === 0 ? (
                  <p className="text-white/20 text-xs font-black uppercase text-center py-8">Нет промокодов</p>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
                    {promos.map((p) => (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between gap-2 p-3 rounded-2xl border ${p.is_active ? "border-[#63f3f7]/10 bg-[#63f3f7]/[0.02]" : "border-white/5 opacity-40"}`}
                      >
                        <div>
                          <p className="font-mono text-xs text-white font-black">{p.code}</p>
                          <p className="text-white/20 text-[10px]">
                            {p.type === "percent" ? `−${p.value}%` : `−${p.value}₽`} · {p.used_count}/{p.max_uses} использований
                          </p>
                        </div>
                        <span className={`text-[9px] px-2 py-1 rounded-lg font-black uppercase border ${p.is_active ? "bg-[#63f3f7]/10 border-[#63f3f7]/20 text-[#63f3f7]" : "bg-white/5 border-white/10 text-white/30"}`}>
                          {p.is_active ? "Активен" : "Выкл"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6"
            >
              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-4">Последние заказы</p>
              {orders.length === 0 ? (
                <p className="text-white/20 text-xs font-black uppercase text-center py-8">Заказов нет</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {orders.slice(0, 10).map((o) => (
                    <div key={o.id} className="flex items-center justify-between gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <p className="font-mono text-[10px] text-white/30 shrink-0">{o.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-white/50 text-xs truncate">{o.user_email}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <p className="text-white/20 text-[10px]">{new Date(o.created_at).toLocaleDateString("ru-RU")}</p>
                        <p className="text-[#63f3f7] font-black text-sm">{o.total_price.toLocaleString()} ₽</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}