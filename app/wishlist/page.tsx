"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWishlistStore } from "@/store/useWishlist";
import GameCard from "@/components/GameCard";
import { Heart, ChevronLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function WishlistPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);

  // Исправляем гидратацию (Zustand Persist)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Слушатель для клавиши Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [router]);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-transparent pt-32 pb-24 px-8 overflow-hidden">
      {/* Фон вынесен сюда для единообразия стиля */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-[1440px] mx-auto">
        
        {/* Шапка страницы */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
          <div className="space-y-8">
            {/* Увеличенная кнопка возврата */}
            <Link 
              href="/" 
              className="group flex items-center gap-4 text-white/30 hover:text-[#63f3f7] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#63f3f7]/50 group-hover:bg-[#63f3f7]/5">
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="text-sm md:text-lg font-michroma uppercase tracking-[0.3em] italic">
                Вернуться в магазин
              </span>
            </Link>

            {/* Заголовок ИЗБРАННОЕ */}
            <h1 className="text-6xl md:text-[120px] font-michroma font-black uppercase italic leading-[0.8] tracking-tighter">
              <span className="text-white">ИЗБРАН</span>
              <span className="text-[#63f3f7] drop-shadow-[0_0_30px_rgba(99,243,247,0.3)]">НОЕ</span>
            </h1>
          </div>
          
          {/* Счетчик */}
          <div className="flex items-center gap-5 bg-white/[0.03] backdrop-blur-xl px-8 py-5 rounded-[2rem] border border-white/5 shadow-2xl">
            <Heart size={24} className="text-[#63f3f7] fill-[#63f3f7]/20" />
            <div className="flex flex-col">
              <span className="text-white font-michroma text-3xl leading-none">{items.length}</span>
              <span className="text-white/20 uppercase text-[9px] font-black tracking-[0.2em] mt-1">Игр отложено</span>
            </div>
          </div>
        </div>

        {/* Сетка товаров */}
        <div className="relative z-20">
          <AnimatePresence mode="popLayout">
            {items.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
              >
                {items.map((game) => (
                  <motion.div
                    key={game.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="relative"
                  >
                    <GameCard game={game} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-[40vh] flex flex-col items-center justify-center text-center space-y-10 border border-white/5 rounded-[4rem] bg-white/[0.01] backdrop-blur-sm"
              >
                <div className="relative">
                  <Heart size={100} className="text-white/[0.02]" />
                  <ShoppingBag size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10" />
                </div>
                <div>
                  <p className="text-white/20 font-michroma text-sm uppercase tracking-[0.4em] mb-10">Список пуст</p>
                  <Link 
                    href="/" 
                    className="inline-block px-12 py-6 bg-[#63f3f7] text-black rounded-2xl font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(99,243,247,0.2)]"
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