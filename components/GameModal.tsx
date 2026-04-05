"use client";

import React, { useState, useEffect, useCallback } from "react"; // Добавили нужные хуки
import { useGameModal } from "@/store/useGameModal";
import { useCartStore } from "@/store/useCart";
import { X, ShoppingCart, Check } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function GameModal() {
  const { isOpen, selectedGame, closeModal } = useGameModal();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  // Функция закрытия, обернутая в useCallback для стабильности
  const handleClose = useCallback(() => {
    closeModal();
  }, [closeModal]);

  // Слушатель клавиши Esc
  useEffect(() => {
    const handleEscKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!selectedGame) return null;

  const handleAddToCart = () => {
    addItem(selectedGame);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={handleClose} // Закрытие по клику на фон
            className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-pointer" 
          />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-[10000] w-full max-w-4xl bg-[#0d0e12] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto"
          >
            <button 
              onClick={handleClose} 
              className="absolute top-6 right-6 z-30 text-white/20 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <div className="relative w-full md:w-2/5 aspect-[3/4] md:aspect-auto">
              <Image 
                src={selectedGame.image} 
                alt={selectedGame.title} 
                fill 
                className="object-cover" 
                unoptimized 
              />
            </div>

            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-6">
              <h2 className="text-3xl md:text-5xl font-michroma text-white uppercase italic leading-tight">
                {selectedGame.title}
              </h2>
              
              <p className="text-white/50 font-light leading-relaxed">
                {selectedGame.description || "Захватывающий экшен в открытом мире ждет вас. Лицензионный ключ будет доступен сразу после оплаты."}
              </p>
              
              <div className="flex items-center gap-3">
                <span className="text-4xl font-michroma text-white">
                  {selectedGame.price.toLocaleString()}
                </span>
                <span className="text-xl text-[#63f3f7] font-michroma">₽</span>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full h-16 md:h-20 rounded-2xl font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 ${
                  isAdded 
                  ? "bg-green-500 text-white" 
                  : "bg-[#63f3f7] text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(99,243,247,0.2)]"
                }`}
              >
                {isAdded ? <Check size={24} /> : <ShoppingCart size={24} />}
                <span>{isAdded ? "Добавлено!" : "Добавить в корзину"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}