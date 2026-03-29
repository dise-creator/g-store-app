"use client";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-[100] bg-[#050507] overflow-hidden pointer-events-none">
      {/* 1. Пурпурное пятно: медленное плавание и пульсация */}
      <motion.div 
        animate={{
          x: [-20, 40, -20],
          y: [-10, 30, -10],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-900/15 blur-[120px] rounded-full opacity-50" 
      />

      {/* 2. Синее пятно: движение в противофазе */}
      <motion.div 
        animate={{
          x: [20, -40, 20],
          y: [10, -30, 10],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-900/15 blur-[120px] rounded-full opacity-40" 
      />
      
      {/* 3. Эффект зернистого стекла (Noise) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      
      {/* 4. Едва заметная сетка для структуры */}
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Дополнительный виньетирующий слой для глубины */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050507]" />
    </div>
  );
}