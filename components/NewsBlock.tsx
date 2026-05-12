"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Check, Clock } from "lucide-react";
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

const TAG_COLORS: Record<
  string,
  { bg: string; text: string; border: string; glow: string }
> = {
  Обновление: {
    bg: "bg-blue-500",
    text: "text-white",
    border: "border-blue-400",
    glow: "shadow-[0_0_12px_rgba(59,130,246,0.6)]",
  },
  Скидки: {
    bg: "bg-red-500",
    text: "text-white",
    border: "border-red-400",
    glow: "shadow-[0_0_12px_rgba(239,68,68,0.6)]",
  },
  Анонс: {
    bg: "bg-[#ff6b00]",
    text: "text-black",
    border: "border-[#ff6b00]",
    glow: "shadow-[0_0_12px_rgba(255,107,0,0.6)]",
  },
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Сегодня";
  if (days === 1) return "Вчера";
  return `${days} дн. назад`;
}

function AddButton({
  linkedGame,
  displayPrice,
}: {
  linkedGame: any;
  displayPrice: number;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ ...linkedGame, price: displayPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <button
      onClick={handleAdd}
      className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
        added
          ? "bg-[#ff6b00] text-black"
          : "bg-white/5 border border-[#ff6b00]/40 text-white/50 hover:bg-[#ff6b00]/10 hover:text-[#ff6b00]"
      }`}
    >
      {added ? <Check size={12} /> : <ShoppingCart size={12} />}
      {added ? "Готово" : "В корзину"}
    </button>
  );
}

function BigNewsCard({ item }: { item: NewsItem }) {
  const { allGames: games } = useGamesStore();
  const { getPrice } = useRegionStore();
  const tag = TAG_COLORS[item.tag];
  const linkedGame = games.find((g) => g.id === item.game_id);
  const displayPrice = linkedGame ? getPrice(linkedGame.price) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col bg-[#0a1650] border border-[#ff6b00]/30 rounded-[2rem] overflow-hidden hover:border-[#ff6b00]/50 transition-all h-full"
    >
      <div className="relative h-72 lg:h-96 overflow-hidden shrink-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1650] via-[#0a1650]/40 to-transparent" />
        {tag && (
          <div
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${tag.bg} ${tag.text} ${tag.border} ${tag.glow}`}
          >
            {item.tag}
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white/50 font-black">
          <Clock size={10} />
          {getTimeAgo(item.created_at)}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 gap-4">
        <div>
          <h3 className="text-white font-black uppercase text-xl lg:text-2xl leading-tight tracking-tight mb-3">
            {item.title}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>

        {linkedGame && displayPrice !== null && (
          <div className="mt-auto pt-4 border-t border-[#ff6b00]/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#ff6b00]/30 shrink-0">
                <Image
                  src={linkedGame.image}
                  alt={linkedGame.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-white/30 text-[9px] uppercase font-black tracking-widest">
                  Купить
                </p>
                <p className="text-white font-black text-sm uppercase truncate max-w-[140px]">
                  {linkedGame.title}
                </p>
                <p className="text-[#ff6b00] text-base font-black">
                  {displayPrice.toLocaleString()} ₽
                </p>
              </div>
            </div>
            <AddButton linkedGame={linkedGame} displayPrice={displayPrice} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SmallNewsCard({ item, index }: { item: NewsItem; index: number }) {
  const { allGames: games } = useGamesStore();
  const { getPrice } = useRegionStore();
  const tag = TAG_COLORS[item.tag];
  const linkedGame = games.find((g) => g.id === item.game_id);
  const displayPrice = linkedGame ? getPrice(linkedGame.price) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative flex flex-row bg-[#0a1650] border border-[#ff6b00]/30 rounded-[1.5rem] overflow-hidden hover:border-[#ff6b00]/50 transition-all"
    >
      <div className="relative w-32 lg:w-40 shrink-0 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1650]/60" />
        {tag && (
          <div
            className={`absolute top-3 left-3 px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${tag.bg} ${tag.text} ${tag.border} ${tag.glow}`}
          >
            {item.tag}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2 min-w-0">
        <div className="flex items-center gap-1 text-white/30 text-[9px] font-black">
          <Clock size={9} />
          {getTimeAgo(item.created_at)}
        </div>
        <h3 className="text-white font-black uppercase text-sm leading-tight tracking-tight">
          {item.title}
        </h3>
        <p className="text-white/30 text-xs leading-relaxed line-clamp-2">
          {item.description}
        </p>
        {linkedGame && displayPrice !== null && (
          <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-[#ff6b00]/10">
            <p className="text-[#ff6b00] font-black text-sm">
              {displayPrice.toLocaleString()} ₽
            </p>
            <AddButton linkedGame={linkedGame} displayPrice={displayPrice} />
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
      .then((data) => {
        setNews(data.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && !news.length) return null;

  const [first, second, ...rest] = news;

  return (
    <section className="w-full py-2">
      <div className="max-w-[1620px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-[#ff6b00] rounded-full shadow-[0_0_15px_#ff6b00]" />
            <h2
              className="text-2xl md:text-3xl font-michroma text-white uppercase tracking-[0.15em] leading-none font-black"
              style={{ WebkitTextStroke: "0.5px rgba(255,255,255,0.3)" }}
            >
              Новости
            </h2>
          </div>
          <Link
            href="/news"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a1860]/60 border border-[#ff6b00]/40 text-white/40 hover:text-[#ff6b00] transition-all text-[10px] font-black uppercase tracking-widest"
          >
            Все новости <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[500px] rounded-[2rem] bg-[#0a1860]/40 animate-pulse" />
            <div className="flex flex-col gap-6">
              <div className="h-[155px] rounded-[1.5rem] bg-[#0a1860]/40 animate-pulse" />
              <div className="h-[155px] rounded-[1.5rem] bg-[#0a1860]/40 animate-pulse" />
              <div className="h-[155px] rounded-[1.5rem] bg-[#0a1860]/40 animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {first && <BigNewsCard item={first} />}
            <div className="flex flex-col gap-4">
              {[second, ...rest].filter(Boolean).map((item, i) => (
                <SmallNewsCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
