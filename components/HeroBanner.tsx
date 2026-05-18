"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamesStore } from "@/store/games";
import { useRegionStore } from "@/store/useRegion";
import { useGameModal } from "@/store/useGameModal";
import { Tag } from "lucide-react";
import Image from "next/image";

const BG = "#08113d";

const FONT_CLASSES = [
  "font-[family-name:var(--font-bangers)] tracking-wider",
  "font-michroma",
  "font-[family-name:var(--font-barlow)]",
  "font-[family-name:var(--font-nunito)]",
];

const COLORS = [
  "#a8c0d8",
  "#ef4444",
  "#4ade80",
  "#ff6b00",
  "#ff6b00",
  "#a855f7",
  "#f472b6",
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { allGames } = useGamesStore();
  const { getPrice } = useRegionStore();
  const { openModal } = useGameModal();

  const bannerGames = allGames.slice(0, 8);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => (prev === bannerGames.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [bannerGames.length]);

  if (!isMounted || bannerGames.length === 0)
    return (
      <div
        className="w-full h-[380px] md:h-[580px] mt-4 md:mt-8 rounded-[2rem] md:rounded-[2.5rem]"
        style={{ backgroundColor: BG }}
      />
    );

  const current = bannerGames[index];
  const color = COLORS[index % COLORS.length];
  const fontClass = FONT_CLASSES[index % FONT_CLASSES.length];
  const displayPrice = getPrice(current.price);
  const discount = current.discount_percent ?? 0;
  const discountedPrice =
    discount > 0
      ? Math.round(displayPrice * (1 - discount / 100))
      : displayPrice;

  const words = current.title.split(" ");
  const mid = Math.ceil(words.length / 2);
  const firstPart = words.slice(0, mid).join(" ");
  const secondPart = words.slice(mid).join(" ");

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal(current);
  };

  return (
    <section
      className="relative w-full h-[380px] md:h-[580px] mt-4 md:mt-8 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden group"
      style={{
        backgroundColor: BG,
        boxShadow: `0 30px 80px -20px ${color}30`,
        border: "1px solid rgba(255, 107, 0, 0.35)",
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

          <div className="relative h-full w-full flex justify-center items-center">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-contain transition-transform duration-[10000ms] scale-100 group-hover:scale-[1.03]"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
              unoptimized
            />
          </div>

          <div
            className="absolute inset-y-0 left-0 z-10 w-full md:w-[55%]"
            style={{
              background: `linear-gradient(to right, ${BG} 0%, ${BG}ee 30%, ${BG}99 60%, transparent 100%)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 z-10 h-32 md:h-40"
            style={{
              background: `linear-gradient(to top, ${BG} 0%, transparent 100%)`,
            }}
          />

          <div className="absolute inset-0 z-20 flex flex-col justify-end md:justify-center px-6 md:px-24 pb-12 md:pb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col gap-3 md:gap-6 max-w-xl"
            >
              {discount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 w-fit"
                >
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs uppercase"
                    style={{
                      backgroundColor: color + "25",
                      border: `1px solid ${color}50`,
                      color,
                    }}
                  >
                    <Tag size={12} />
                    Скидка {discount}%
                  </div>
                </motion.div>
              )}

              <h1
                className={`${fontClass} text-4xl sm:text-5xl md:text-8xl font-black uppercase text-white leading-[0.85] drop-shadow-2xl`}
              >
                {firstPart} <br />
                <span style={{ color }} className="opacity-95">
                  {secondPart}
                </span>
              </h1>

              <div className="flex items-center gap-3 md:gap-6">
                <div className="flex flex-col">
                  {discount > 0 && (
                    <span className="text-white/30 text-xs md:text-sm font-black line-through">
                      {displayPrice.toLocaleString()} ₽
                    </span>
                  )}
                  <span
                    className="font-black text-2xl md:text-4xl"
                    style={{ color }}
                  >
                    {discountedPrice.toLocaleString()} ₽
                  </span>
                </div>

                <button
                  onClick={handleAction}
                  className="relative px-6 md:px-10 py-3 md:py-4 text-black font-extrabold uppercase rounded-xl md:rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl z-30 text-xs md:text-base"
                  style={{ backgroundColor: color }}
                >
                  Забрать сейчас
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 md:bottom-10 left-6 md:left-24 z-30 flex gap-2 flex-wrap">
        {bannerGames.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${
              i === index
                ? "w-8 md:w-12"
                : "w-2 md:w-2.5 bg-white/10 hover:bg-white/30"
            }`}
            style={{ backgroundColor: i === index ? color : "" }}
          />
        ))}
      </div>
    </section>
  );
}
