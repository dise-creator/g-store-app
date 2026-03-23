"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    // ГЛАВНЫЙ КОНТЕЙНЕР БАННЕРА
    // Добавили border-radius для четкого контура баннера
    <section className="relative w-full h-[450px] md:h-[550px] rounded-[3rem] overflow-hidden bg-[#1a1a1e] group
      {/* ФИОЛЕТОВАЯ ТЕНЬ ОТ БАННЕРА */}
      {/* shadow-[0_30px_60px_-15px_rgba(168,85,247,0.3)] — мягкое фиолетовое свечение */}
      shadow-[0_30px_80px_-20px_rgba(168,85,247,0.35)]
      {/* Дополнительный легкий неоновый кант */}
      border border-[#a855f7]/5
    ">
      
      {/* 1. ГРАДИЕНТНЫЕ МАСКИ ДЛЯ СЛИЯНИЯ С ФОНОМ (z-10) */}
      <div className="absolute inset-0 z-10 
        after:absolute after:inset-x-0 after:bottom-0 after:h-40 after:bg-gradient-to-t after:from-[#0a0a0c] after:to-transparent 
        before:absolute before:inset-x-0 before:top-0 before:h-20 before:bg-gradient-to-b before:from-[#0a0a0c] before:to-transparent
      " />
      
      {/* 2. ИЗОБРАЖЕНИЕ (z-0, четкое, как в оригинале) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070" 
          alt="Hero Banner Gamestore"
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110" // Увеличили scale для динамики
          priority
        />
        
        {/* ЛЕГКОЕ РАСПЛЫТИЕ ПОВЕРХ */}
        {/* Добавляемbackdrop-blur всего на 1px для мягкости */}
        <div className="absolute inset-0 backdrop-blur-[1.5px] bg-[#0a0a0c]/10 transition-opacity duration-500 group-hover:opacity-0" />
      </div>

      {/* 3. КОНТЕНТ (Четкий, поверх всего) */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 md:px-24">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }} // ИСПРАВЛЕНО ts(2322)
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/30 text-[#a855f7] text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl">
            Эксклюзивное предложение
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white mb-6 leading-[0.85]">
            CYBERPUNK <br /> <span className="text-[#a855f7]">2077</span>
          </h1>
          <p className="text-white/50 text-lg font-medium mb-10 max-w-lg italic">
            Станьте легендой Найт-Сити уже сегодня. Скидка 40% только до конца недели.
          </p>
          
          <button className="px-10 py-5 bg-[#a855f7] text-white font-black uppercase italic rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.7)] transition-all active:scale-95">
            Забрать за 2 500 ₽
          </button>
        </motion.div>
      </div>

    </section>
  );
}