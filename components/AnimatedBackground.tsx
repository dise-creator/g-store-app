"use client";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 bg-[#0d1528] overflow-hidden pointer-events-none">
      
      {/* 1. Синее пятно слева */}
      <motion.div 
        animate={{ x: ["-30%", "10%", "-30%"], y: ["-10%", "20%", "-10%"], scale: [1, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-700/30 blur-[150px] rounded-full opacity-70" 
      />

      {/* 2. Синее пятно справа */}
      <motion.div 
        animate={{ x: ["30%", "-10%", "30%"], y: ["10%", "-20%", "10%"], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-800/25 blur-[150px] rounded-full opacity-60" 
      />

      {/* 3. Бирюзовый акцент */}
      <motion.div 
        animate={{ x: ["0%", "15%", "0%"], y: ["0%", "-15%", "0%"], scale: [1, 1.05, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-[#63f3f7]/[0.05] blur-[120px] rounded-full" 
      />

      {/* Сетка */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Виньетка */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#080f1e_100%)] opacity-50" />
    </div>
  );
}