"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegionStore, REGIONS, type Region } from "@/store/useRegion";
import { ChevronDown } from "lucide-react";

export default function RegionSwitcher() {
  const { region, setRegion } = useRegionStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentRegion = REGIONS[region];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border transition-all active:scale-95 ${
          isOpen
            ? "bg-white/10 border-white/20"
            : "bg-white/[0.03] border-white/5 hover:bg-white/[0.08]"
        }`}
      >
        <span className="text-lg">{currentRegion.flag}</span>
        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest hidden md:block">
          {currentRegion.code}
        </span>
        <ChevronDown
          size={12}
          className={`text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 bg-[#0a0a0b] border border-white/10 rounded-2xl p-2 shadow-2xl z-[110] backdrop-blur-3xl"
            >
              <p className="text-[8px] text-white/20 uppercase font-black tracking-widest px-3 py-2">
                Выберите регион
              </p>
              {Object.values(REGIONS).map((r) => (
                <button
                  key={r.code}
                  onClick={() => { setRegion(r.code); setIsOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    region === r.code
                      ? "bg-[#63f3f7]/10 border border-[#63f3f7]/20"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span className="text-xl">{r.flag}</span>
                  <div className="text-left">
                    <p className={`text-xs font-black uppercase italic ${region === r.code ? "text-[#63f3f7]" : "text-white/50"}`}>
                      {r.name}
                    </p>
                    {r.code !== 'RU' && (
                      <p className="text-[8px] text-white/20 font-bold">
                        ~{Math.round(r.coefficient * 100)}% от цены
                      </p>
                    )}
                  </div>
                  {region === r.code && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#63f3f7]" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}