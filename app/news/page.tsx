"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import { useGamesStore } from "@/store/games";
import { useRegionStore } from "@/store/useRegion";
import AnimatedBackground from "@/components/AnimatedBackground";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  game_id: string;
  created_at: string;
}

const TAG_COLORS: Record<string, string> = {
  "Обновление": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Скидки": "bg-red-500/20 text-red-400 border-red-500/30",
  "Анонс": "bg-[#63f3f7]/10 text-[#63f3f7] border-[#63f3f7]/20",
};

function NewsPageCard({ item, index }: { item: NewsItem; index: number }) {
  const { allGames: games } = useGamesStore();
  const addItem = useCartStore((state) => state.addItem);
  const { getPrice } = useRegionStore();
  const [added, setAdded] = useState(false);

  const linkedGame = games.find((g) => g.id === item.game_id);
  const displayPrice = linkedGame ? getPrice(linkedGame.price) : null;

  const handleAdd = () => {
    if (!linkedGame) return;
    addItem({ ...linkedGame, price: displayPrice! });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group flex flex-col md:flex-row bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/10 hover:bg-white/[0.05] transition-all"
    >
      {/* Картинка — большая */}
      <div className="relative w-full md:w-96 h-56 md:h-auto shrink-0 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0f1e]/60 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/80 to-transparent md:hidden" />

        {/* Тег */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${TAG_COLORS[item.tag] || "bg-white/10 text-white/50 border-white/10"}`}>
          {item.tag}
        </div>
      </div>

      {/* Контент */}
      <div className="flex flex-col flex-1 justify-between p-8 gap-6">
        <div className="flex flex-col gap-4">
          {/* Дата */}
          <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em]">
            {new Date(item.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          {/* Заголовок */}
          <h2 className="text-white font-black uppercase italic text-2xl md:text-3xl leading-tight tracking-tight">
            {item.title}
          </h2>

          {/* Описание */}
          <p className="text-white/40 text-base leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Привязанная игра */}
        {linkedGame && (
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/5">
            <div className="flex items-center gap-4">
              <img
                src={linkedGame.image}
                alt={linkedGame.title}
                className="w-14 h-14 rounded-2xl object-cover border border-white/10"
              />
              <div>
                <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Купить игру</p>
                <p className="text-white font-black text-base uppercase italic">{linkedGame.title}</p>
                <p className="text-[#63f3f7] text-xl font-black">{displayPrice?.toLocaleString()} ₽</p>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className={`shrink-0 flex items-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all ${
                added
                  ? "bg-[#63f3f7] text-black shadow-[0_0_25px_rgba(99,243,247,0.3)]"
                  : "bg-white/5 border border-white/10 text-white/50 hover:bg-[#63f3f7]/10 hover:border-[#63f3f7]/30 hover:text-[#63f3f7]"
              }`}
            >
              {added ? <Check size={16} /> : <ShoppingCart size={16} />}
              {added ? "Добавлено!" : "В корзину"}
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => { setNews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="relative min-h-screen pt-40 pb-20 px-6 md:px-10">
      <AnimatedBackground />
      <div className="relative z-10 max-w-[1200px] mx-auto">

        {/* Шапка */}
        <div className="flex items-center gap-6 mb-12">
          <Link
            href="/"
            className="group flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-white/30 hover:text-[#63f3f7] hover:border-[#63f3f7]/40 hover:bg-[#63f3f7]/5 transition-all shrink-0"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex items-baseline gap-1">
            <h1 className="text-3xl md:text-4xl font-michroma font-black uppercase italic tracking-tighter text-white">
              ИГ
            </h1>
            <h1 className="text-3xl md:text-4xl font-michroma font-black uppercase italic tracking-tighter text-[#63f3f7] drop-shadow-[0_0_20px_rgba(99,243,247,0.4)]">
              РОВЫЕ НОВОСТИ
            </h1>
          </div>
        </div>

        {/* Список */}
        <div className="flex flex-col gap-6">
          {loading
            ? Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-56 rounded-[2.5rem] bg-white/[0.02] animate-pulse" />
              ))
            : news.map((item, i) => (
                <NewsPageCard key={item.id} item={item} index={i} />
              ))
          }
        </div>
      </div>
    </main>
  );
}