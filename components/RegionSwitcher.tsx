"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import { useRegionStore, REGIONS, type Region } from "@/store/useRegion";

const regionColors: Record<
  Region,
  { bg: string; border: string; text: string; glow: string; iconBg: string }
> = {
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

const DISCOUNT_LABELS: Record<Region, string> = {
  TR: "Скидка до 65%",
  IN: "Скидка до 45%",
};

const flagUrls: Record<Region, string> = {
  TR: "https://flagcdn.com/w40/tr.png",
  IN: "https://flagcdn.com/w40/in.png",
};

export default function RegionSwitcher() {
  const { region, setRegion } = useRegionStore();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentRegion = REGIONS[region];
  const colors = regionColors[region];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Десктоп */}
      <div className="hidden md:flex items-center gap-1.5 p-1 bg-[#0a1860]/60 border border-[#f5a623]/30 rounded-2xl">
        {Object.values(REGIONS).map((r) => {
          const isActive = region === r.code;
          const c = regionColors[r.code];
          return (
            <motion.button
              key={r.code}
              onClick={() => setRegion(r.code)}
              whileTap={{ scale: 0.93 }}
              className={`relative flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-300 ${
                isActive
                  ? `${c.bg} ${c.border} ${c.glow}`
                  : "bg-transparent border-transparent hover:bg-white/5"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${
                  isActive ? c.iconBg : "bg-white/10"
                }`}
              >
                <Image
                  src={flagUrls[r.code]}
                  alt={r.name}
                  width={32}
                  height={32}
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span
                className={`text-sm font-black uppercase tracking-wide transition-colors ${
                  isActive ? c.text : "text-white/25"
                }`}
              >
                {r.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="region-indicator"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff5555]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Мобилка */}
      <div className="flex md:hidden">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.93 }}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-300 ${colors.bg} ${colors.border} ${colors.glow}`}
        >
          <div
            className={`w-6 h-6 rounded-lg overflow-hidden shrink-0 ${colors.iconBg}`}
          >
            <Image
              src={flagUrls[region]}
              alt={currentRegion.name}
              width={24}
              height={24}
              className="object-cover"
              unoptimized
            />
          </div>
          <span className={`text-xs font-black uppercase ${colors.text}`}>
            {currentRegion.name}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown size={14} className={colors.text} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-[calc(100%+8px)] left-0 z-[200] min-w-[160px] bg-[#0d1f6e] border border-[#f5a623]/40 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            >
              {Object.values(REGIONS).map((r, i) => {
                const isActive = region === r.code;
                const c = regionColors[r.code];
                return (
                  <motion.button
                    key={r.code}
                    onClick={() => {
                      setRegion(r.code);
                      setIsOpen(false);
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all ${
                      isActive
                        ? `${c.bg} border-l-2 ${c.border}`
                        : "hover:bg-white/5 border-l-2 border-transparent"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl overflow-hidden shrink-0 ${isActive ? c.iconBg : "bg-white/10"}`}
                    >
                      <Image
                        src={flagUrls[r.code]}
                        alt={r.name}
                        width={32}
                        height={32}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <span
                        className={`text-sm font-black uppercase ${isActive ? c.text : "text-white/60"}`}
                      >
                        {r.name}
                      </span>
                      <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">
                        {DISCOUNT_LABELS[r.code]}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <Check size={14} className={c.text} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
