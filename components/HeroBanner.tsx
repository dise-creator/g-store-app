"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#1a1a1e] group">
      {/* Изображение с Unsplash */}
      <Image
        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070" 
        alt="Banner Game"
        fill
        className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110"
        priority
      />

      {/* Контент баннера */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent flex flex-col justify-center px-10 md:px-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a855f7]">
              Эксклюзивное предложение
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-4 leading-none">
            CYBERPUNK <br /> <span className="text-[#a855f7]">2077</span>
          </h1>
          
          <p className="max-w-md text-white/40 text-sm md:text-base font-bold italic uppercase tracking-tight mb-8">
            Станьте легендой Найт-Сити уже сегодня. <br /> Скидка 40% только до конца недели.
          </p>

          <button className="px-8 py-4 bg-[#a855f7] text-white text-sm font-black uppercase italic rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all active:scale-95">
            Забрать за 2 500 ₽
          </button>
        </motion.div>
      </div>

      {/* Нижний градиент для плавного перехода к слайдеру */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0c] to-transparent" />
    </section>
  );
}