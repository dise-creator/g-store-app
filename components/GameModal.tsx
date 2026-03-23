"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star, Clock } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";

export default function GameModal({ game, isOpen, onClose }: any) {
  const addItem = useCartStore((state) => state.addItem);

  if (!game) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Задний фон с блюром */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Контент модалки */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-[#111114] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Кнопка закрытия */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Левая часть: Изображение */}
            <div className="relative w-full md:w-1/2 aspect-[3/4]">
              <Image src={game.image} alt={game.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent" />
            </div>

            {/* Правая часть: Инфо */}
            <div className="p-10 md:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#a855f7]/20 text-[#a855f7] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Популярное
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold">4.9</span>
                </div>
              </div>

              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none">
                {game.title}
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                Погрузитесь в невероятное приключение от Digital Universe. 
                Лучшая графика, захватывающий сюжет и полная свобода действий ждут вас.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="block text-[10px] text-white/30 uppercase font-bold mb-1">Жанр</span>
                    <span className="text-white text-sm font-bold">Action / RPG</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="block text-[10px] text-white/30 uppercase font-bold mb-1">Платформа</span>
                    <span className="text-white text-sm font-bold">PC / PS5</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div>
                    <span className="block text-[10px] text-white/30 uppercase font-bold mb-1">Цена издания</span>
                    <span className="text-3xl font-black italic text-white">{game.price.toLocaleString()} ₽</span>
                </div>
                <button 
                  onClick={() => {
                    addItem(game);
                    onClose();
                  }}
                  className="flex items-center gap-3 bg-[#a855f7] hover:bg-[#9333ea] text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-tighter transition-all transform active:scale-95 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                >
                  <ShoppingCart size={20} />
                  Купить
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}