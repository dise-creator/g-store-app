"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Game } from "@/store/games";

// Расширяем интерфейс, чтобы он соответствовал нашему новому Game
interface BannerSlide extends Game {
  subtitle: string;
  desc: string;
  color: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "2", // Строка для синхронизации со Store и Supabase
    title: "КИБЕРПАНК",
    subtitle: "2077",
    category: "RPG",
    desc: "Станьте легендой Найт-Сити уже сегодня. Скидка 40% только до конца недели.",
    shortDescription: "Экшен-RPG в Найт-Сити.",
    fullDescription: "", 
    price: 2500,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
    screenshots: [],
    editions: [],
    color: "#63f3f7" // Твой фирменный цвет
  },
  {
    id: "1",
    title: "СТАРФИЛД",
    subtitle: "DIGITAL",
    category: "RPG",
    desc: "Исследуйте бесконечные просторы космоса в новой ролевой игре от Bethesda.",
    shortDescription: "Космическая одиссея.",
    fullDescription: "",
    price: 4200,
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2070",
    screenshots: [],
    editions: [],
    color: "#3b82f6"
  },
  {
    id: "3",
    title: "ЭЛДЕН",
    subtitle: "РИНГ",
    category: "RPG",
    desc: "Восстань, Погасшая душа, и стань владыкой Элдена в Междуземье.",
    shortDescription: "Хардкорное приключение.",
    fullDescription: "",
    price: 3900,
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070",
    screenshots: [],
    editions: [],
    color: "#eab308"
  }
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === BANNER_SLIDES.length - 1 ? 0 : prev + 1));
    }, 8000); // Чуть увеличил интервал для читаемости
    return () => clearInterval(timer);
  }, []);

  const current = BANNER_SLIDES[index];

  return (
    <section 
      className="relative w-full h-[500px] md:h-[650px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-[#0a0a0c] group transition-all duration-1000 shadow-2xl"
      style={{ boxShadow: `0 40px 100px -30px ${current.color}30` }} 
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
          {/* Улучшенные маски для текста */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
          
          <Image
            src={current.image}
            alt={current.title}
            fill
            className="object-cover transition-transform duration-[10000ms] scale-110 group-hover:scale-100"
            priority
            unoptimized
          />
          
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 md:px-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-3xl"
            >
              <div 
                className="inline-flex items-center px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border backdrop-blur-md"
                style={{ backgroundColor: `${current.color}15`, borderColor: `${current.color}30`, color: current.color }}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse mr-3" />
                Featured Game
              </div>
              
              <h1 className="text-6xl sm:text-7xl md:text-[9rem] font-black uppercase italic tracking-tighter text-white mb-8 leading-[0.8] drop-shadow-2xl">
                {current.title} <br /> 
                <span style={{ color: current.color }} className="opacity-90">{current.subtitle}</span>
              </h1>
              
              <p className="text-white/50 text-base md:text-xl font-medium mb-12 max-w-lg italic leading-relaxed">
                {current.desc}
              </p>
              
              <button 
                className="group/btn relative px-10 md:px-14 py-5 md:py-6 text-black font-black uppercase italic rounded-[1.5rem] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                style={{ backgroundColor: current.color }}
              >
                {/* Исправляем гидратацию через suppressHydrationWarning */}
                <span className="relative z-10 flex items-center gap-3 text-lg" suppressHydrationWarning>
                  Забрать за {current.price.toLocaleString()} ₽
                </span>
                <div className="absolute inset-0 bg-white/30 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Индикаторы */}
      <div className="absolute bottom-12 left-10 md:left-24 z-30 flex gap-3">
        {BANNER_SLIDES.map((_, i) => (
          <button 
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-700 ${i === index ? "w-16" : "w-6 bg-white/10 hover:bg-white/20"}`}
            style={{ backgroundColor: i === index ? current.color : "" }}
          />
        ))}
      </div>
    </section>
  );
}