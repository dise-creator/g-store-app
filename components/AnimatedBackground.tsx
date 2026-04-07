"use client";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    // Убедись, что здесь стоит именно -z-10 или ниже
    <div className="fixed inset-0 -z-50 bg-[#050507] overflow-hidden pointer-events-none">
      
      {/* 1. Глубокое пурпурное пятно */}
      <motion.div 
        animate={{ x: ["-30%", "10%", "-30%"], y: ["-10%", "20%", "-10%"], scale: [1, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-900/10 blur-[150px] rounded-full opacity-60" 
      />

      {/* 2. Глубокое синее пятно */}
      <motion.div 
        animate={{ x: ["30%", "-10%", "30%"], y: ["10%", "-20%", "10%"], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-900/10 blur-[150px] rounded-full opacity-50" 
      />
      
      {/* Шумовой слой и сетка остаются, они прозрачные */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,...")` }} />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* УДАЛИЛИ финальный виньетирующий слой, который мог всё чернить */}
    </div>
  );
}