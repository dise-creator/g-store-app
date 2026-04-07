"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Game } from "@/store/games";

interface BannerSlide extends Game {
  subtitle: string;
  desc: string;
  color: string;
  fontClass: string; // Специальный шрифт для каждой игры
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "gow-1", 
    title: "GOD OF",
    subtitle: "WAR",
    category: "Action",
    desc: "Продолжение легендарной саги. Отправьтесь в эпическое путешествие вместе с Кратосом и Атреем по всем девяти мирам.",
    shortDescription: "Экшен-приключение.",
    fullDescription: "", 
    price: 3500,
    image: "/hero/1.jpg", 
    screenshots: [],
    editions: [],
    color: "#a8c0d8",
    fontClass: "font-[family-name:var(--font-arapey)]" // Античный стиль
  },
  {
    id: "spidey-1",
    title: "SPIDER",
    subtitle: "MAN",
    category: "Action",
    desc: "Станьте величайшим защитником Нью-Йорка. Невероятные полеты на паутине и динамичные сражения ждут вас.",
    shortDescription: "Приключения супергероя.",
    fullDescription: "",
    price: 2900,
    image: "/hero/2.jpg", 
    screenshots: [],
    editions: [],
    color: "#ef4444",
    fontClass: "font-[family-name:var(--font-bangers)] tracking-wider" // Стиль комиксов
  },
  {
    id: "tlou-1",
    title: "LAST OF",
    subtitle: "US II",
    category: "Action",
    desc: "Эмоциональная и жестокая история Элли в мире, где грани между добром и злом окончательно стерты.",
    shortDescription: "Драматический триллер.",
    fullDescription: "",
    price: 2500,
    image: "/hero/3.jpg", 
    screenshots: [],
    editions: [],
    color: "#4ade80",
    fontClass: "font-[family-name:var(--font-im-fell)]" // Постапокалиптический стиль
  }
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === BANNER_SLIDES.length - 1 ? 0 : prev + 1));
    }, 8000); 
    return () => clearInterval(timer);
  }, []);

  const current = BANNER_SLIDES[index];

  return (
    <section 
      className="relative w-full h-[480px] md:h-[600px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-[#0a0a0c] group transition-all duration-1000"
      style={{ boxShadow: `0 30px 80px -20px ${current.color}25` }} 
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
          {/* Градиенты для читаемости текста */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0c]/50 via-transparent to-transparent" />
          
          <img
            src={current.image}
            alt={current.title}
            className="absolute inset-0 z-0 w-full h-full object-cover transition-transform duration-[10000ms] scale-105 group-hover:scale-100"
          />
          
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 md:px-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-2xl"
            >
              {/* Тематический заголовок */}
              <h1 className={`${current.fontClass} text-5xl sm:text-6xl md:text-7xl font-black uppercase italic text-white mb-6 leading-[0.9] drop-shadow-xl`}>
                {current.title} <br /> 
                <span style={{ color: current.color }} className="opacity-95">{current.subtitle}</span>
              </h1>
              
              <p className="text-white/60 text-sm md:text-lg font-medium mb-10 max-w-lg italic leading-relaxed text-balance">
                {current.desc}
              </p>
              
              {/* Компактная кнопка */}
              <button 
                className="group/btn relative px-8 py-3.5 text-black font-extrabold uppercase italic rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ backgroundColor: current.color }}
              >
                <span className="relative z-10 flex items-center gap-2.5 text-sm md:text-base">
                  Купить за {current.price.toLocaleString()} ₽
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Индикаторы слайдов */}
      <div className="absolute bottom-10 left-12 md:left-24 z-30 flex gap-2.5">
        {BANNER_SLIDES.map((_, i) => (
          <button 
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-10" : "w-4 bg-white/10 hover:bg-white/20"}`}
            style={{ backgroundColor: i === index ? current.color : "" }}
          />
        ))}
      </div>
    </section>
  );
}