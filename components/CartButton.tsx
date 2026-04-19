"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShoppingBag, Zap, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";

interface CartButtonProps {
  onClick: () => void;
  totalAmount: number;
  totalItems: number;
}

export default function CartButton({ onClick, totalAmount, totalItems }: CartButtonProps) {
  const [pulse, setPulse] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const prevItems = useRef(totalItems);
  const particleId = useRef(0);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const { items, removeItem } = useCartStore();

  useEffect(() => {
    if (totalItems > prevItems.current) {
      setPulse(true);
      setTimeout(() => setPulse(false), 700);
      const newParticles = Array.from({ length: 6 }, () => ({
        id: particleId.current++,
        x: Math.random() * 100 - 50,
        y: Math.random() * 60 - 80,
      }));
      setParticles(prev => [...prev, ...newParticles]);
      setTimeout(() => setParticles([]), 800);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsHovered(false);
    };
    if (isHovered) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isHovered]);

  const isEmpty = totalItems === 0;

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (!isEmpty) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setIsHovered(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.92 }}
        animate={pulse ? { scale: [1, 1.15, 0.92, 1.06, 1] } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="group relative h-12 rounded-2xl flex items-center overflow-visible"
        style={{ minWidth: isEmpty ? "48px" : "auto" }}
      >
        <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
          isEmpty
            ? "bg-white/[0.05] border border-white/10"
            : "bg-[#00FFFF] border border-[#00FFFF]/50"
        }`} />

        <AnimatePresence>
          {pulse && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 rounded-2xl bg-[#00FFFF]/40 blur-xl"
            />
          )}
        </AnimatePresence>

        {!isEmpty && (
          <motion.div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ zIndex: 1 }}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
            />
          </motion.div>
        )}

        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, scale: 0, x: p.x, y: p.y }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-[#00FFFF] pointer-events-none"
              style={{ zIndex: 20 }}
            />
          ))}
        </AnimatePresence>

        <div className="relative flex items-center gap-0 z-10 px-1">
          <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isEmpty ? "" : "ml-1"}`}>
            <motion.div
              animate={pulse ? { rotate: [-15, 15, -10, 10, 0], y: [0, -4, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <ShoppingBag
                size={20}
                className={`transition-all duration-300 ${isEmpty ? "text-white/40 group-hover:text-white" : "text-black"}`}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {totalItems > 0 && (
                <motion.div
                  key={totalItems}
                  initial={{ scale: 0, rotate: -180, y: 5 }}
                  animate={{ scale: 1, rotate: 0, y: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-black text-[#00FFFF] text-[8px] font-black flex items-center justify-center rounded-full border border-[#00FFFF]/60 px-1"
                >
                  {totalItems}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!isEmpty && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-1 pr-4 pl-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={totalAmount}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className="text-[15px] font-black italic text-black tracking-tighter whitespace-nowrap"
                    >
                      {totalAmount.toLocaleString()} ₽
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {pulse && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              animate={{ opacity: 1, scale: 1.4, rotate: 10 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute -top-3 -right-2 z-20 pointer-events-none"
            >
              <Zap size={14} className="text-[#00FFFF] fill-[#00FFFF] drop-shadow-[0_0_6px_#00FFFF]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Всплывающее окно */}
      <AnimatePresence>
        {isHovered && !isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute top-[calc(100%+14px)] right-0 w-[420px] bg-[#0a0a0c] border border-white/10 rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.7)] overflow-hidden z-[200]"
          >
            {/* Шапка */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center">
                  <ShoppingBag size={15} className="text-[#00FFFF]" />
                </div>
                <div>
                  <p className="text-white font-black italic uppercase text-sm tracking-widest">Корзина</p>
                  <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                    {totalItems} товар{totalItems === 1 ? "" : totalItems < 5 ? "а" : "ов"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHovered(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Список товаров */}
            <div className="max-h-80 overflow-y-auto no-scrollbar py-2">
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div
                    key={item.cartItemId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.03] transition-all group/item"
                  >
                    {/* Фото */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/5 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>

                    {/* Инфо */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-xs font-black italic uppercase truncate leading-tight">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-[#00FFFF] text-sm font-black">
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </p>
                        {item.quantity > 1 && (
                          <span className="text-white/20 text-[10px] font-bold">
                            {item.price.toLocaleString()} × {item.quantity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Удалить */}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeItem(item.cartItemId); }}
                      className="opacity-0 group-hover/item:opacity-100 w-8 h-8 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 flex items-center justify-center transition-all shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Футер */}
            <div className="px-6 py-5 bg-white/[0.02] border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/30 text-[10px] uppercase font-black tracking-widest">Итого к оплате</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-black text-2xl italic">{totalAmount.toLocaleString()}</span>
                  <span className="text-[#00FFFF] font-black text-sm">₽</span>
                </div>
              </div>
              <button
                onClick={() => { setIsHovered(false); onClick(); }}
                className="w-full py-3.5 bg-[#00FFFF] text-black font-black text-xs uppercase italic tracking-[0.2em] rounded-xl hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] transition-all active:scale-95"
              >
                Оформить заказ →
              </button>
              <p className="text-center text-white/15 text-[9px] uppercase tracking-widest mt-3 font-black">
                Нажми ESC чтобы закрыть
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}