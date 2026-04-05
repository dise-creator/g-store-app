"use client";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    // ПРИНУДИТЕЛЬНО ВЫРУБАЕМ pointer-events, чтобы клики пролетали сквозь фон
    <div className="fixed inset-0 -z-[999] bg-[#050507] overflow-hidden pointer-events-none">
      
      {/* 1. Глубокое пурпурное пятно: медленное плавание */}
      <motion.div 
        animate={{
          x: ["-30%", "10%", "-30%"],
          y: ["-10%", "20%", "-10%"],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-900/10 blur-[150px] rounded-full opacity-60 pointer-events-none" 
      />

      {/* 2. Глубокое синее пятно: движение в противофазе */}
      <motion.div 
        animate={{
          x: ["30%", "-10%", "30%"],
          y: ["10%", "-20%", "10%"],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-900/10 blur-[150px] rounded-full opacity-50 pointer-events-none" 
      />
      
      {/* 3. Эффект зернистого стекла (Noise) через SVG DataURI */}
      {/* Это уберет 403 ошибку в консоли */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* 4. Едва заметная сетка для структуры */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      {/* Финальный виньетирующий слой для глубины */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050507] pointer-events-none" />
    </div>
  );
}