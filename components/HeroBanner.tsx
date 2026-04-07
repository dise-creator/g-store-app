"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Game, useGamesStore } from "@/store/games";
import { useRouter } from "next/navigation";

// ОПРЕДЕЛЕНИЕ ТИПОВ (Исправляет ошибки со скриншота 6)
interface BannerSlide extends Game {
  subtitle: string;
  desc: string;
  color: string;
  fontClass: string;
}

// ДАННЫЕ (Исправляет ошибки со скриншота 6)
const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "gow-1", 
    title: "GOD OF",
    subtitle: "WAR",
    category: "Action",
    desc: "Продолжение легендарной саги. Отправьтесь в эпическое путешествие вместе с Кратосом и Атреем по всем девяти мирам.",
    shortDescription: "Экшен-приключение.",
    fullDescription: "Эпическое путешествие по скандинавским мирам.", 
    price: 3500,
    image: "/hero/1.jpg", 
    screenshots: ["/hero/1.jpg"],
    editions: [{ name: "Standard", price: 3500, features: ["Базовая игра"] }],
    color: "#a8c0d8",
    fontClass: "font-[family-name:var(--font-arapey)]"
  },
  {
    id: "spidey-1",
    title: "SPIDER",
    subtitle: "MAN",
    category: "Action",
    desc: "Станьте величайшим защитником Нью-Йорка. Невероятные полеты на паутине и динамичные сражения ждут вас.",
    shortDescription: "Приключения супергероя.",
    fullDescription: "Новая глава приключений Человека-паука.",
    price: 2900,
    image: "/hero/2.jpg", 
    screenshots: ["/hero/2.jpg"],
    editions: [{ name: "Standard", price: 2900, features: ["Базовая игра"] }],
    color: "#ef4444",
    fontClass: "font-[family-name:var(--font-bangers)] tracking-wider"
  },
  {
    id: "tlou-1",
    title: "LAST OF",
    subtitle: "US II",
    category: "Action",
    desc: "Эмоциональная и жестокая история Элли в мире, где грани между добром и злом окончательно стерты.",
    shortDescription: "Драматический триллер.",
    fullDescription: "Суровая история выживания и мести.",
    price: 2500,
    image: "/hero/3.jpg", 
    screenshots: ["/hero/3.jpg"],
    editions: [{ name: "Standard", price: 2500, features: ["Базовая игра"] }],
    color: "#4ade80",
    fontClass: "font-[family-name:var(--font-im-fell)]"
  }
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const setSelectedGame = useGamesStore((state) => state.setSelectedGame);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => (prev === BANNER_SLIDES.length - 1 ? 0 : prev + 1));
    }, 8000); 
    return () => clearInterval(timer);
  }, []);

  // Заглушка для предотвращения ошибки Hydration (скриншот 4)
  if (!isMounted) return <div className="w-full h-[450px] md:h-[520px] mt-8 bg-[#0a0a0c] rounded-[2.5rem]" />;

  const current = BANNER_SLIDES[index];

  const handleAction = (e: React.MouseEvent, game: BannerSlide) => {
    e.stopPropagation();
    setSelectedGame(game);
  };

  return (
    <section 
      /* mt-8 — отступ от хедера, h-[520px] — новая компактная высота */
      className="relative w-full h-[450px] md:h-[520px] mt-8 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-[#0a0a0c] group shadow-2xl"
      style={{ boxShadow: `0 30px 80px -20px ${current.color}25` }} 
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 cursor-pointer"
          onClick={(e) => handleAction(e, current)}
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent" />
          
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
              className="max-w-xl"
            >
              <h1 className={`${current.fontClass} text-4xl sm:text-5xl md:text-6xl font-black uppercase italic text-white mb-4 leading-[0.9] drop-shadow-xl`}>
                {current.title} <br /> 
                <span style={{ color: current.color }} className="opacity-95">{current.subtitle}</span>
              </h1>
              
              {/* Компактное описание (макс. 2 строки) */}
              <p className="text-white/60 text-sm md:text-base font-medium mb-8 max-w-[380px] italic leading-relaxed line-clamp-2">
                {current.desc}
              </p>
              
              <button 
                onClick={(e) => handleAction(e, current)}
                className="relative px-8 py-3 text-black font-extrabold uppercase italic rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg z-30"
                style={{ backgroundColor: current.color }}
              >
                <span className="relative z-10 text-sm md:text-base">
                  Забрать за {current.price.toLocaleString()} ₽
                </span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Индикаторы слайдов */}
      <div className="absolute bottom-10 left-12 md:left-24 z-30 flex gap-2">
        {BANNER_SLIDES.map((_, i) => (
          <button 
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-10" : "w-4 bg-white/10"}`}
            style={{ backgroundColor: i === index ? current.color : "" }}
          />
        ))}
      </div>
    </section>
  );
}