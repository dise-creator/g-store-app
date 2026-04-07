"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Game, useGamesStore } from "@/store/games";

interface BannerSlide extends Game {
  subtitle: string;
  desc: string;
  color: string;
  fontClass: string;
}

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

  if (!isMounted) return <div className="w-full h-[450px] md:h-[520px] mt-8 bg-[#0a0a0c] rounded-[2.5rem]" />;

  const current = BANNER_SLIDES[index];

  const handleAction = (e: React.MouseEvent, game: BannerSlide) => {
    e.stopPropagation();
    setSelectedGame(game);
  };

  return (
    <section 
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
          className="absolute inset-0 cursor-pointer flex items-center justify-center"
          onClick={(e) => handleAction(e, current)}
        >
          {/* ЧЕРНЫЙ ФОН */}
          <div className="absolute inset-0 bg-[#0a0a0c]" />

          {/* КАРТИНКА С УМНОЙ МАСКОЙ КРАЕВ */}
          <div className="relative h-full w-full flex justify-center items-center">
             <img
              src={current.image}
              alt={current.title}
              className="h-full w-auto max-w-none object-contain transition-transform duration-[10000ms] scale-100 group-hover:scale-[1.03]"
              style={{
                /* Горизонтальное и вертикальное затухание одновременно */
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />
          </div>

          {/* ГРАДИЕНТ ДЛЯ ЧИТАЕМОСТИ ТЕКСТА */}
          <div className="absolute inset-y-0 left-0 z-10 w-full md:w-1/2 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />
          
          {/* КОНТЕНТ */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 md:px-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-xl"
            >
              <h1 className={`${current.fontClass} text-4xl sm:text-5xl md:text-7xl font-black uppercase italic text-white mb-4 leading-[0.85] drop-shadow-2xl`}>
                {current.title} <br /> 
                <span style={{ color: current.color }} className="opacity-95">{current.subtitle}</span>
              </h1>
              
              <p className="text-white/60 text-sm md:text-base font-medium mb-8 max-w-[380px] italic leading-relaxed line-clamp-2 drop-shadow-md">
                {current.desc}
              </p>
              
              <button 
                onClick={(e) => handleAction(e, current)}
                className="relative px-10 py-4 text-black font-extrabold uppercase italic rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl z-30 flex items-center gap-3"
                style={{ backgroundColor: current.color }}
              >
                <span className="relative z-10 text-sm md:text-base tracking-tighter">
                  Забрать за {current.price.toLocaleString()} ₽
                </span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-12 md:left-24 z-30 flex gap-3">
        {BANNER_SLIDES.map((_, i) => (
          <button 
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-12" : "w-4 bg-white/10 hover:bg-white/30"}`}
            style={{ backgroundColor: i === index ? current.color : "" }}
          />
        ))}
      </div>
    </section>
  );
}