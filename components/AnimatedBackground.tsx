"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#0a0a0c]">
      {/* Большое фиолетовое пятно (Плавающее) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#a855f7]/15 blur-[120px]"
      />

      {/* Синее пятно для контраста */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -80, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[#3b82f6]/10 blur-[100px]"
      />

      {/* Текстура шума для "дорогого" градиента */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}