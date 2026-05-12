"use client";

import React from "react";
import Link from "next/link";
import { useAdmin } from "@/lib/useAdmin";
import { motion } from "framer-motion";
import { Key, BarChart3, Upload, Newspaper, Tag, ShieldX } from "lucide-react";

const SECTIONS = [
  {
    href: "/admin/keys",
    icon: Key,
    title: "Ключи",
    desc: "Загрузка и управление ваучерами PSN",
    color: "#ff6b00",
  },
  {
    href: "/admin/import",
    icon: Upload,
    title: "Импорт игр",
    desc: "Добавление и обновление игр в каталоге",
    color: "#a855f7",
  },
  {
    href: "/admin/analytics",
    icon: BarChart3,
    title: "Аналитика",
    desc: "Продажи, выручка, статистика заказов",
    color: "#10b981",
  },
  {
    href: "/admin/promo",
    icon: Tag,
    title: "Промокоды",
    desc: "Создание и управление промокодами",
    color: "#f59e0b",
  },
  {
    href: "/admin/news",
    icon: Newspaper,
    title: "Новости",
    desc: "Публикация новостей и анонсов",
    color: "#ef4444",
  },
];

export default function AdminPage() {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ShieldX size={48} className="text-red-400" />
        <p className="text-white/30 font-black uppercase text-xl">
          Нет доступа
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#ff6b00] text-black font-black uppercase text-xs rounded-2xl"
        >
          На главную
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-16 pb-20 px-6">
      <div className="max-w-[800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 mt-16"
        >
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            АДМИН <span className="text-[#ff6b00]">ПАНЕЛЬ</span>
          </h1>
          <p className="text-white/30 text-sm mt-1">
            Выбери раздел для управления
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={section.href}
                  className="group flex items-center gap-4 p-5 bg-[#0a1860]/60 hover:bg-white/[0.06] border border-[#ff6b00]/40 hover:border-white/20 rounded-[2rem] transition-all"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all"
                    style={{
                      backgroundColor: section.color + "20",
                      border: `1px solid ${section.color}30`,
                    }}
                  >
                    <Icon size={24} style={{ color: section.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black uppercase text-base tracking-tight">
                      {section.title}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">
                      {section.desc}
                    </p>
                  </div>
                  <div className="text-white/20 group-hover:text-white/60 transition-all text-lg font-black">
                    →
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-4 bg-[#0a1860]/40 border border-[#ff6b00]/30 text-white/30 hover:text-white rounded-[2rem] font-black text-xs uppercase transition-all"
          >
            ← На главную
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
