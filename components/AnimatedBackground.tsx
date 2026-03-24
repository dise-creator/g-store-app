"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    // Фиксированный контейнер на весь экран, под всеми элементами (-z-50)
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#0a0a0c]">
      
      {/* 1. БОЛЬШОЕ ФИОЛЕТОВОЕ ПЯТНО (ПЛАВАЮЩЕЕ) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1], // Пульсация размера
          x: [0, 80, 0],     // Движение по горизонтали
          y: [0, 40, 0],     // Движение по вертикали
        }}
        transition={{
          duration: 20,       // Время одного цикла анимации
          repeat: Infinity,   // Бесконечное повторение
          ease: "linear",     // Плавное линейное движение
        }}
        className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#a855f7]/10 blur-[120px]"
      />

      {/* 2. СИНЕЕ ПЯТНО ДЛЯ КОНТРАСТА */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -60, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] rounded-full bg-[#3b82f6]/5 blur-[100px]"
      />

      {/* 3. ТЕКСТУРА ШУМА ДЛЯ РЕАЛИЗМА */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}