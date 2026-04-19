"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import { useGamesStore } from "@/store/games";
import { useRegionStore } from "@/store/useRegion";

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

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const { allGames: games } = useGamesStore();
  const addItem = useCartStore((state) => state.addItem);
  const { getPrice } = useRegionStore();
  const [added, setAdded] = useState(false);

  const linkedGame = games.find((g) => g.id === item.game_id);
  const displayPrice = linkedGame ? getPrice(linkedGame.price) : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!linkedGame) return;
    addItem({ ...linkedGame, price: displayPrice! });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/10 hover:bg-white/[0.05] transition-all"
    >
      {/* Картинка — высокая */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/20 to-transparent" />

        {/* Тег */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${TAG_COLORS[item.tag] || "bg-white/10 text-white/50 border-white/10"}`}>
          {item.tag}
        </div>

        {/* Дата */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-[10px] text-white/50 font-black">
          {new Date(item.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
        </div>
      </div>

      {/* Контент */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div>
          <h3 className="text-white font-black uppercase italic text-lg leading-tight tracking-tight mb-2">
            {item.title}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Привязанная игра */}
        {linkedGame && (
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={linkedGame.image}
                alt={linkedGame.title}
                className="w-12 h-12 rounded-xl object-cover border border-white/10"
              />
              <div>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Купить игру</p>
                <p className="text-white font-black text-sm uppercase italic truncate max-w-[120px]">{linkedGame.title}</p>
                <p className="text-[#63f3f7] text-base font-black">{displayPrice?.toLocaleString()} ₽</p>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                added
                  ? "bg-[#63f3f7] text-black shadow-[0_0_20px_rgba(99,243,247,0.3)]"
                  : "bg-white/5 border border-white/10 text-white/50 hover:bg-[#63f3f7]/10 hover:border-[#63f3f7]/30 hover:text-[#63f3f7]"
              }`}
            >
              {added ? <Check size={14} /> : <ShoppingCart size={14} />}
              {added ? "Добавлено" : "В корзину"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function NewsBlock() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => { setNews(data.slice(0, 3)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && !news.length) return null;

  return (
    <section className="w-full  py-2">
      <div className="max-w-[1620px] mx-auto">

        {/* Шапка */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-[#63f3f7] rounded-full shadow-[0_0_15px_#63f3f7]" />
            <h2
              className="text-2xl md:text-3xl font-michroma text-white uppercase tracking-[0.15em] leading-none italic font-black"
              style={{ WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.3)" }}
            >
              Новости
            </h2>
          </div>
          <Link
            href="/news"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-[#63f3f7] hover:border-[#63f3f7]/30 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            Все новости
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-[420px] rounded-[2rem] bg-white/[0.02] animate-pulse" />
              ))
            : news.map((item, i) => (
                <NewsCard key={item.id} item={item} index={i} />
              ))
          }
        </div>
      </div>
    </section>
  );
}