"use client";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 bg-[#111113] overflow-hidden pointer-events-none">
      
      {/* 1. Серое пятно слева */}
      <motion.div 
        animate={{ x: ["-30%", "10%", "-30%"], y: ["-10%", "20%", "-10%"], scale: [1, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-slate-500/10 blur-[150px] rounded-full opacity-60" 
      />

      {/* 2. Чуть светлее серое пятно справа */}
      <motion.div 
        animate={{ x: ["30%", "-10%", "30%"], y: ["10%", "-20%", "10%"], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-zinc-400/8 blur-[150px] rounded-full opacity-50" 
      />

      {/* 3. Лёгкий бирюзовый акцент — чтоб не было совсем мертво */}
      <motion.div 
        animate={{ x: ["0%", "15%", "0%"], y: ["0%", "-15%", "0%"], scale: [1, 1.05, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-[#63f3f7]/[0.03] blur-[120px] rounded-full" 
      />

      {/* Сетка */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Виньетка по краям */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0a0a0c_100%)] opacity-60" />
    </div>
  );
}