"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWishlistStore } from "@/store/useWishlist";
import GameCard from "@/components/GameCard";
import { Heart, ChevronLeft, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function WishlistPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const clearAll = useWishlistStore((state) => state.clearAll);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [router]);

  if (!mounted) return null;

  const handleClearAll = () => {
    if (confirmClear) {
      clearAll();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <main className="relative min-h-screen bg-transparent pt-40 pb-20 px-8 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 max-w-[1440px] mx-auto">

        {/* Шапка */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="group flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-white/30 hover:text-[#63f3f7] hover:border-[#63f3f7]/40 hover:bg-[#63f3f7]/5 transition-all"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="flex items-baseline gap-1">
              <h1 className="text-3xl md:text-4xl font-michroma font-black uppercase italic tracking-tighter text-white">
                ИЗБРАН
              </h1>
              <h1 className="text-3xl md:text-4xl font-michroma font-black uppercase italic tracking-tighter text-[#63f3f7] drop-shadow-[0_0_20px_rgba(99,243,247,0.4)]">
                НОЕ
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Кнопка очистить всё */}
            {items.length > 0 && (
              <motion.button
                onClick={handleClearAll}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all ${
                  confirmClear
                    ? "bg-red-500/20 border-red-500/40 text-red-400"
                    : "bg-white/[0.03] border-white/5 text-white/30 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
                }`}
              >
                <Trash2 size={14} />
                {confirmClear ? "Точно очистить?" : "Очистить всё"}
              </motion.button>
            )}

            {/* Счётчик */}
            <div className="flex items-center gap-3 px-5 py-3 bg-white/[0.03] border border-white/5 rounded-2xl">
              <Heart size={16} className="text-[#63f3f7] fill-[#63f3f7]/20" />
              <span className="text-white font-michroma text-xl leading-none">{items.length}</span>
              <span className="text-white/20 uppercase text-[9px] font-black tracking-[0.2em]">игр</span>
            </div>
          </div>
        </div>

        {/* Сетка */}
        <div className="relative z-20">
          <AnimatePresence mode="popLayout">
            {items.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10"
              >
                {items.map((game, index) => (
                  <motion.div
                    key={game.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94], duration: 0.5 }}
                    className="relative group/card"
                  >
                    {/* Кнопка удаления на карточке */}
                    
                 {/* <motion.button
                    onClick={() => toggleItem(game)}
                     whileTap={{ scale: 0.9 }}
                         className="absolute top-2 right-2 z-[70] w-7 h-7 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all hover:bg-red-500/80 hover:border-red-400/30"
                    >
                      <X size={12} className="text-white/60 hover:text-white" />
                  </motion.button> */}

                    <GameCard game={game} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-[50vh] flex flex-col items-center justify-center text-center space-y-8 border border-white/5 rounded-[3rem] bg-white/[0.01]"
              >
                <div className="relative">
                  <Heart size={80} className="text-white/[0.03]" />
                  <ShoppingBag size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10" />
                </div>
                <div className="space-y-6">
                  <p className="text-white/20 font-michroma text-xs uppercase tracking-[0.4em]">Список пуст</p>
                  <Link
                    href="/"
                    className="inline-block px-10 py-4 bg-[#63f3f7] text-black rounded-2xl font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(99,243,247,0.2)] text-sm"
                  >
                    Перейти к покупкам
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}