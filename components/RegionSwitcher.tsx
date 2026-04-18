"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegionStore, REGIONS, type Region } from "@/store/useRegion";

// Цвета для каждого региона
const regionColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  RU: {
    bg: "bg-[#1a1a2e]",
    border: "border-[#4444aa]",
    text: "text-[#8888ff]",
    glow: "shadow-[0_0_20px_rgba(100,100,255,0.3)]",
  },
  TR: {
    bg: "bg-[#2e0a0a]",
    border: "border-[#cc2222]",
    text: "text-[#ff5555]",
    glow: "shadow-[0_0_20px_rgba(255,60,60,0.3)]",
  },
  IN: {
    bg: "bg-[#1a1200]",
    border: "border-[#cc8800]",
    text: "text-[#ffaa00]",
    glow: "shadow-[0_0_20px_rgba(255,170,0,0.3)]",
  },
};

export default function RegionSwitcher() {
  const { region, setRegion } = useRegionStore();

  return (
    <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
      {Object.values(REGIONS).map((r) => {
        const isActive = region === r.code;
        const colors = regionColors[r.code];

        return (
          <motion.button
            key={r.code}
            onClick={() => setRegion(r.code as Region)}
            whileTap={{ scale: 0.93 }}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${
              isActive
                ? `${colors.bg} ${colors.border} ${colors.glow}`
                : "bg-transparent border-transparent hover:bg-white/5"
            }`}
          >
            {/* Флаг */}
            <span className="text-base leading-none">{r.flag}</span>

            {/* Название региона */}
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors hidden md:block ${
              isActive ? colors.text : "text-white/25"
            }`}>
              {r.code}
            </span>

            {/* Активный индикатор — точка снизу */}
            {isActive && (
              <motion.div
                layoutId="region-indicator"
                className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${colors.text.replace("text-", "bg-")}`}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}