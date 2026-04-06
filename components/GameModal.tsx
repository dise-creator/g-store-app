"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useGameModal } from "@/store/useGameModal";
import { useCartStore } from "@/store/useCart";
import { useWishlistStore } from "@/store/useWishlist"; // Добавили для сердечка
import { X, ShoppingCart, Check, Heart } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function GameModal() {
  const { isOpen, selectedGame, closeModal } = useGameModal();
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  
  const [selectedEditionIndex, setSelectedEditionIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  // Сброс состояния при смене игры
  useEffect(() => {
    setSelectedEditionIndex(0);
    setIsAdded(false);
  }, [selectedGame]);

  const handleClose = useCallback(() => {
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, handleClose]);

  if (!selectedGame) return null;

  // Логика выбора версии
  const editions = selectedGame.editions || [];
  const currentEdition = editions.length > 0 
    ? editions[selectedEditionIndex] 
    : { name: "Standard", price: selectedGame.price, features: ["Базовая игра"] };

  const isInWishlist = wishlistItems.some(item => item.id === selectedGame.id);

  const handleAddToCart = () => {
    addItem({
      ...selectedGame,
      title: `${selectedGame.title} (${currentEdition.name})`,
      price: currentEdition.price
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto">
          {/* Фон для закрытия */}
          <div className="absolute inset-0 cursor-pointer" onClick={handleClose} />

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="relative z-10 w-full max-w-6xl bg-[#0d0e12] border border-white/10 rounded-[3rem] overflow-hidden my-auto pointer-events-auto"
          >
            {/* ВЕРХНИЙ БЛОК: Визуал и селектор версий */}
            <div className="flex flex-col lg:flex-row border-b border-white/5">
              <div className="relative w-full lg:w-1/2 aspect-square lg:aspect-auto min-h-[450px]">
                <Image 
                  src={selectedGame.image} 
                  alt={selectedGame.title} 
                  fill 
                  className="object-cover" 
                  unoptimized 
                />
              </div>

              <div className="flex-1 p-8 lg:p-12 flex flex-col gap-8">
                <button onClick={handleClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                  <X size={32} />
                </button>

                <div className="space-y-4">
                  <h2 className="text-5xl lg:text-7xl font-michroma uppercase italic leading-none tracking-tighter text-white">
                    {selectedGame.title}
                  </h2>
                  <p className="text-white/40 italic text-sm">{selectedGame.shortDescription}</p>
                </div>

                {/* Выбор STANDARD / DELUXE ( map теперь безопасен ) */}
                {editions.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                      {editions.map((edition, idx) => (
                        <button
                          key={edition.name}
                          onClick={() => setSelectedEditionIndex(idx)}
                          className={`flex-1 py-4 rounded-xl font-michroma text-[10px] uppercase transition-all ${
                            selectedEditionIndex === idx 
                            ? "bg-[#63f3f7] text-black shadow-[0_0_20px_rgba(99,243,247,0.3)]" 
                            : "text-white/40 hover:text-white"
                          }`}
                        >
                          {edition.name}
                        </button>
                      ))}
                    </div>
                    {/* Фишки текущего издания */}
                    <ul className="space-y-2">
                      {currentEdition.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] text-white/60 italic">
                          <div className="w-1 h-1 rounded-full bg-[#63f3f7]" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Цена и Кнопка */}
                <div className="mt-auto pt-8 flex flex-col gap-6">
                  <div className="flex items-end gap-2 font-michroma" suppressHydrationWarning>
                    <span className="text-6xl text-white tracking-tighter">
                      {currentEdition.price.toLocaleString()}
                    </span>
                    <span className="text-2xl text-[#63f3f7] mb-2">₽</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={handleAddToCart}
                      className={`flex-[4] h-20 rounded-2xl font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 ${
                        isAdded ? "bg-green-500 text-white" : "bg-[#63f3f7] text-black hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    >
                      {isAdded ? <Check size={24} /> : <ShoppingCart size={24} />}
                      <span>{isAdded ? "Добавлено" : "Добавить в корзину"}</span>
                    </button>
                    <button 
                      onClick={() => toggleItem(selectedGame)}
                      className={`flex-1 h-20 rounded-2xl border transition-all flex items-center justify-center ${
                        isInWishlist ? "border-[#63f3f7] text-[#63f3f7] bg-[#63f3f7]/5" : "border-white/10 text-white/20 hover:text-white"
                      }`}
                    >
                      <Heart size={28} fill={isInWishlist ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* НИЖНИЙ БЛОК: Скриншоты и Описание */}
            <div className="p-8 lg:p-12 bg-[#0a0b0d] space-y-16">
              {/* Сетка скриншотов */}
              {selectedGame.screenshots && selectedGame.screenshots.length > 0 && (
                <div className="space-y-8">
                  <h4 className="text-[10px] font-michroma text-white/20 uppercase tracking-[0.4em]">Скриншоты игры</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedGame.screenshots.map((src, i) => (
                      <div key={i} className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-white/5">
                        <Image src={src} alt="screenshot" fill className="object-cover opacity-70 hover:opacity-100 transition-opacity" unoptimized />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Текст описания */}
              <div className="space-y-6 max-w-4xl border-l-2 border-[#63f3f7]/20 pl-10">
                <h4 className="text-[10px] font-michroma text-[#63f3f7] uppercase tracking-[0.4em]">Описание</h4>
                <p className="text-white/50 text-lg leading-relaxed italic">
                  {selectedGame.fullDescription || "Описание скоро будет добавлено."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}