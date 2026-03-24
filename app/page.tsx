"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import GameSlider from "@/components/GameSlider";
import HeroBanner from "@/components/HeroBanner";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ALL_GAMES } from "@/store/games";

// Исправленные варианты анимации с явной типизацией Variants
const sectionVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15,
      // Убрали duration, так как он конфликтует с spring в типизации Framer Motion
    }
  },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const longList = Array(3).fill(ALL_GAMES).flat().map((game, index) => ({
    ...game,
    id: index + 1
  }));

  return (
    <main className="relative min-h-screen pt-40 pb-20 bg-transparent">
      {/* Живой фон как на видео */}
      <AnimatedBackground />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col gap-16">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <HeroBanner />
        </motion.div>
        
        {/* Секция с анимацией при скролле */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <GameSlider 
            title="Топ предложения" 
            games={longList} 
            isLoading={isLoading} 
          />
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <GameSlider 
            title="Недавно добавленные" 
            games={[...longList].reverse()} 
            isLoading={isLoading} 
          />
        </motion.section>

      </div>
    </main>
  );
}