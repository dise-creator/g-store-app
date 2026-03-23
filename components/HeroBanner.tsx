"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Данные для слайдов баннера
const BANNER_SLIDES = [
  {
    id: 1,
    title: "CYBERPUNK",
    subtitle: "2077",
    desc: "Станьте легендой Найт-Сити уже сегодня. Скидка 40% только до конца недели.",
    price: "2 500 ₽",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
    color: "#a855f7"
  },
  {
    id: 2,
    title: "STARFIELD",
    subtitle: "DIGITAL",
    desc: "Исследуйте бесконечные просторы космоса в новой ролевой игре от Bethesda.",
    price: "4 200 ₽",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2070",
    color: "#3b82f6"
  },
  {
    id: 3,
    title: "ELDEN",
    subtitle: "RING",
    desc: "Восстань, Погасшая душа, и стань владыкой Элдена в Междуземье.",
    price: "3 900 ₽",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070",
    color: "#eab308"
  }
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  // Автоматическая смена каждые 5 секунд
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === BANNER_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = BANNER_SLIDES[index];

  return (
    <section 
      className="relative w-full h-[450px] md:h-[550px] rounded-[3rem] overflow-hidden bg-[#1a1a1e] group transition-all duration-700"
      style={{ boxShadow: `0 30px 80px -20px ${current.color}59` }} // Динамическая фиолетовая (и не только) тень
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* 1. ГРАДИЕНТНЫЕ МАСКИ */}
          <div className="absolute inset-0 z-10 
            after:absolute after:inset-x-0 after:bottom-0 after:h-40 after:bg-gradient-to-t after:from-[#0a0a0c] after:to-transparent 
            before:absolute before:inset-x-0 before:top-0 before:h-20 before:bg-gradient-to-b before:from-[#0a0a0c] before:to-transparent
          " />
          
          {/* 2. ИЗОБРАЖЕНИЕ */}
          <Image
            src={current.image}
            alt={current.title}
            fill
            className="object-cover transition-transform duration-[5000ms] scale-110 group-hover:scale-100"
            priority
          />
          
          <div className="absolute inset-0 backdrop-blur-[1px] bg-[#0a0a0c]/20" />

          {/* 3. КОНТЕНТ */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 md:px-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }} //
              className="max-w-2xl"
            >
              <span 
                className="inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl border"
                style={{ backgroundColor: `${current.color}33`, borderColor: `${current.color}4d`, color: current.color }}
              >
                Эксклюзивное предложение
              </span>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white mb-6 leading-[0.85]">
                {current.title} <br /> <span style={{ color: current.color }}>{current.subtitle}</span>
              </h1>
              <p className="text-white/50 text-lg font-medium mb-10 max-w-lg italic">
                {current.desc}
              </p>
              
              <button 
                className="px-10 py-5 text-white font-black uppercase italic rounded-2xl transition-all active:scale-95 shadow-2xl"
                style={{ backgroundColor: current.color }}
              >
                Забрать за {current.price}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ИНДИКАТОРЫ (Точки внизу) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {BANNER_SLIDES.map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-8" : "w-2 bg-white/20"}`}
            style={{ backgroundColor: i === index ? current.color : "" }}
          />
        ))}
      </div>
    </section>
  );
}