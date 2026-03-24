"use client";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-[100] bg-[#050507] overflow-hidden pointer-events-none">
      {/* Мягкие световые пятна для объема */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-900/20 blur-[120px] rounded-full opacity-50" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-900/20 blur-[120px] rounded-full opacity-40" />
      
      {/* Эффект зернистого стекла (Noise) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      
      {/* Едва заметная сетка для структуры */}
      <div className="absolute inset-0 opacity-[0.1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
}