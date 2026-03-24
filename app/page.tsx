"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import GameSlider from "@/components/GameSlider";
import HeroBanner from "@/components/HeroBanner";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ALL_GAMES } from "@/store/games";

// Типизация для анимации появления (Scroll Reveal)
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 60, damping: 15 }
  },
};

// Список будущих жанров для масштабирования сайта
const GENRES = [
  { title: "Популярные новинки", key: "new" },
  { title: "Экшен и приключения", key: "action" },
  { title: "Ролевые игры (RPG)", key: "rpg" },
  { title: "Стратегии", key: "strategy" },
  { title: "Шутеры", key: "shooters" },
  { title: "Инди-хиты", key: "indie" },
  { title: "Спортивные игры", key: "sports" },
  { title: "Симуляторы", key: "sim" },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Подготавливаем данные для слайдеров
  // Пока просто дублируем список, перемешивая его для визуального разнообразия
  const getShuffledGames = () => [...ALL_GAMES].sort(() => Math.random() - 0.5);

  return (
    <main className="relative min-h-screen pt-32 pb-40 bg-transparent">
      {/* Твой кастомный живой фон */}
      <AnimatedBackground />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col gap-24">
        
        {/* Приветственный баннер */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroBanner />
        </motion.div>
        
        {/* ОСНОВНОЙ БЛОК: ТОП ПРЕДЛОЖЕНИЯ */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <GameSlider 
            title="Топ предложения" 
            games={ALL_GAMES} 
            isLoading={isLoading} 
          />
        </motion.section>

        {/* ДИНАМИЧЕСКИЕ СЕКЦИИ ПО ЖАНРАМ (Дубликаты) */}
        {GENRES.map((genre, index) => (
          <motion.section
            key={genre.key}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            // Добавляем небольшую задержку для каждой следующей секции при быстром скролле
            transition={{ delay: index * 0.05 }}
          >
            <GameSlider 
              title={genre.title} 
              // Пока передаем перемешанный общий список игр
              games={getShuffledGames()} 
              isLoading={isLoading} 
            />
          </motion.section>
        ))}

      </div>
    </main>
  );
}