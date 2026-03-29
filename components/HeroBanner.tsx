"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Game } from "@/store/games"; // Используем общий интерфейс

// Расширяем интерфейс для баннера
interface BannerSlide extends Game {
  subtitle: string;
  desc: string;
  color: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 2, // Синхронизируем ID с твоим стором
    title: "КИБЕРПАНК",
    subtitle: "2077",
    desc: "Станьте легендой Найт-Сити уже сегодня. Скидка 40% только до конца недели.",
    price: 2500,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
    color: "#a855f7"
  },
  {
    id: 1,
    title: "СТАРФИЛД",
    subtitle: "DIGITAL",
    desc: "Исследуйте бесконечные просторы космоса в новой ролевой игре от Bethesda.",
    price: 4200,
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2070",
    color: "#3b82f6"
  },
  {
    id: 3,
    title: "ЭЛДЕН",
    subtitle: "РИНГ",
    desc: "Восстань, Погасшая душа, и стань владыкой Элдена в Междуземье.",
    price: 3900,
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070",
    color: "#eab308"
  }
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === BANNER_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = BANNER_SLIDES[index];

  return (
    <section 
      className="relative w-full h-[450px] md:h-[550px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-[#1a1a1e] group transition-all duration-700"
      style={{ boxShadow: `0 30px 80px -20px ${current.color}40` }} 
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Маски: градиенты для лучшей читаемости текста */}
          <div className="absolute inset-0 z-10 
            bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent
            after:absolute after:inset-x-0 after:bottom-0 after:h-40 after:bg-gradient-to-t after:from-[#0a0a0c] after:to-transparent 
          " />
          
          <Image
            src={current.image}
            alt={current.title}
            fill
            className="object-cover transition-transform duration-[7000ms] scale-110 group-hover:scale-105"
            priority
          />
          
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-2xl"
            >
              <span 
                className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border backdrop-blur-md"
                style={{ backgroundColor: `${current.color}20`, borderColor: `${current.color}40`, color: current.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-2" />
                Эксклюзив
              </span>
              
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white mb-6 leading-[0.85]">
                {current.title} <br /> 
                <span style={{ color: current.color }} className="drop-shadow-2xl">{current.subtitle}</span>
              </h1>
              
              <p className="text-white/60 text-sm md:text-lg font-medium mb-10 max-w-lg italic line-clamp-2 md:line-clamp-none">
                {current.desc}
              </p>
              
              <button 
                className="group/btn relative px-8 md:px-12 py-4 md:py-5 text-white font-black uppercase italic rounded-2xl overflow-hidden transition-all active:scale-95 shadow-2xl"
                style={{ backgroundColor: current.color }}
              >
                <span className="relative z-10">Забрать за {current.price.toLocaleString()} ₽</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Индикаторы с плавным переключением */}
      <div className="absolute bottom-8 md:bottom-12 left-8 md:left-24 z-30 flex gap-2.5">
        {BANNER_SLIDES.map((_, i) => (
          <button 
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-10" : "w-4 bg-white/10 hover:bg-white/30"}`}
            style={{ backgroundColor: i === index ? current.color : "" }}
          />
        ))}
      </div>
    </section>
  );
}