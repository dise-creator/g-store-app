"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamesStore, Game } from "@/store/games";
import { useRegionStore } from "@/store/useRegion";
import { Tag } from "lucide-react";

const BG = "#0d1528";

const FONT_CLASSES = [
  "font-[family-name:var(--font-arapey)]",
  "font-[family-name:var(--font-bangers)] tracking-wider",
  "font-[family-name:var(--font-im-fell)]",
  "font-michroma",
];

const COLORS = [
  "#a8c0d8",
  "#ef4444",
  "#4ade80",
  "#63f3f7",
  "#f5a623",
  "#a855f7",
  "#f472b6",
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { allGames, setSelectedGame } = useGamesStore();
  const { getPrice } = useRegionStore();

  // Берём первые 8 игр для баннера
  const bannerGames = allGames.slice(0, 8);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => (prev === bannerGames.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [bannerGames.length]);

  if (!isMounted || bannerGames.length === 0) return (
    <div className="w-full h-[500px] md:h-[580px] mt-8 rounded-[2.5rem]" style={{ backgroundColor: BG }} />
  );

  const current = bannerGames[index];
  const color = COLORS[index % COLORS.length];
  const fontClass = FONT_CLASSES[index % FONT_CLASSES.length];
  const displayPrice = getPrice(current.price);
  const discount = current.discount_percent || 0;
  const discountedPrice = discount > 0
    ? Math.round(displayPrice * (1 - discount / 100))
    : displayPrice;

  // Разбиваем название на две части
  const words = current.title.split(" ");
  const firstPart = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const secondPart = words.slice(Math.ceil(words.length / 2)).join(" ");

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedGame(current);
  };

  return (
    <section
      className="relative w-full h-[500px] md:h-[580px] mt-8 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group"
      style={{
        backgroundColor: BG,
        boxShadow: `0 30px 80px -20px ${color}30`,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 cursor-pointer flex items-center justify-center"
          onClick={handleAction}
        >
          <div className="absolute inset-0" style={{ backgroundColor: BG }} />

          {/* Картинка */}
          <div className="relative h-full w-full flex justify-center items-center">
            <img
              src={current.image}
              alt={current.title}
              className="h-full w-auto max-w-none object-contain transition-transform duration-[10000ms] scale-100 group-hover:scale-[1.03]"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />
          </div>

          {/* Левый градиент */}
          <div
            className="absolute inset-y-0 left-0 z-10 w-full md:w-[55%]"
            style={{ background: `linear-gradient(to right, ${BG} 0%, ${BG}cc 45%, transparent 100%)` }}
          />

          {/* Нижний градиент */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 h-40"
            style={{ background: `linear-gradient(to top, ${BG} 0%, transparent 100%)` }}
          />

          {/* Контент */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 md:px-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-xl flex flex-col gap-6"
            >
              {/* Бейдж скидки */}
              {discount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 w-fit"
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm uppercase italic"
                    style={{
                      backgroundColor: color + "25",
                      border: `1px solid ${color}50`,
                      color,
                    }}
                  >
                    <Tag size={14} />
                    Скидка {discount}%
                  </div>
                </motion.div>
              )}

              {/* Заголовок */}
              <h1 className={`${fontClass} text-5xl sm:text-6xl md:text-8xl font-black uppercase italic text-white leading-[0.85] drop-shadow-2xl`}>
                {firstPart} <br />
                <span style={{ color }} className="opacity-95">{secondPart}</span>
              </h1>

              {/* Цена + кнопка */}
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  {discount > 0 && (
                    <span className="text-white/30 text-sm font-black line-through">
                      {displayPrice.toLocaleString()} ₽
                    </span>
                  )}
                  <span className="font-black text-3xl md:text-4xl italic" style={{ color }}>
                    {discountedPrice.toLocaleString()} ₽
                  </span>
                </div>

                <button
                  onClick={handleAction}
                  className="relative px-10 py-4 text-black font-extrabold uppercase italic rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl z-30"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-sm md:text-base tracking-tighter">
                    Забрать сейчас
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Точки навигации */}
      <div className="absolute bottom-10 left-12 md:left-24 z-30 flex gap-3 flex-wrap max-w-xs">
        {bannerGames.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-12" : "w-2.5 bg-white/10 hover:bg-white/30"
            }`}
            style={{ backgroundColor: i === index ? color : "" }}
          />
        ))}
      </div>
    </section>
  );
}