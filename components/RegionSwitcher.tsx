"use client";

import { motion } from "framer-motion";
import { useRegionStore, REGIONS, type Region } from "@/store/useRegion";

const regionColors: Record<string, { bg: string; border: string; text: string; glow: string; iconBg: string }> = {
  TR: {
    bg: "bg-[#2e0a0a]",
    border: "border-[#cc2222]",
    text: "text-[#ff5555]",
    glow: "shadow-[0_0_20px_rgba(255,60,60,0.3)]",
    iconBg: "bg-[#cc2222]",
  },
  IN: {
    bg: "bg-[#1a1200]",
    border: "border-[#cc8800]",
    text: "text-[#ffaa00]",
    glow: "shadow-[0_0_20px_rgba(255,170,0,0.3)]",
    iconBg: "bg-[#cc8800]",
  },
};

const flagUrls: Record<string, string> = {
  TR: "https://flagcdn.com/w40/tr.png",
  IN: "https://flagcdn.com/w40/in.png",
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
            className={`relative flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-300 ${
              isActive
                ? `${colors.bg} ${colors.border} ${colors.glow}`
                : "bg-transparent border-transparent hover:bg-white/5"
            }`}
          >
            {/* Флаг — картинка в скруглённом квадрате */}
            <div className={`w-8 h-8 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${
              isActive ? colors.iconBg : "bg-white/10"
            }`}>
              <img
                src={flagUrls[r.code]}
                alt={r.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Полное название */}
            <span className={`text-sm font-black uppercase italic tracking-wide transition-colors ${
              isActive ? colors.text : "text-white/25"
            }`}>
              {r.name}
            </span>

            {/* Активный индикатор */}
            {isActive && (
              <motion.div
                layoutId="region-indicator"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: isActive ? "#ff5555" : "#ffaa00" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}