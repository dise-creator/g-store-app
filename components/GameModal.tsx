"use client";

import React, { useState, useEffect } from "react";
import { useGameModal } from "@/store/useGameModal";
import { useCartStore } from "@/store/useCart";
import { X, ShoppingCart, Check } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function GameModal() {
  const { isOpen, selectedGame, closeModal } = useGameModal();
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedEditionIndex, setSelectedEditionIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setSelectedEditionIndex(0);
    setIsAdded(false);
  }, [isOpen, selectedGame]);

  if (!selectedGame) return null;

  const editions = selectedGame.editions || [];
  const screenshots = selectedGame.screenshots || [];
  const description = selectedGame.fullDescription || (selectedGame as any).full_description || selectedGame.shortDescription;

  const basePrice = Number(selectedGame.price || 0);
  const currentEdition = editions.length > 0 
    ? { name: editions[selectedEditionIndex].name, price: Number(editions[selectedEditionIndex].price) }
    : { name: "Standard", price: basePrice };

  const handleAddToCart = () => {
    addItem({ ...selectedGame, price: currentEdition.price, selectedEdition: currentEdition.name });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 cursor-pointer" />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-5xl bg-[#0d0e12] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col pointer-events-auto shadow-2xl"
          >
            <button onClick={closeModal} className="absolute top-6 right-6 z-50 text-white/20 hover:text-white transition-colors p-2">
              <X size={32} />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-2/5 aspect-[3/4] md:aspect-auto min-h-[400px]">
                <Image src={selectedGame.image} alt={selectedGame.title} fill className="object-cover" unoptimized />
              </div>

              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-10 text-center">
                <h2 className="text-4xl md:text-5xl font-michroma text-white uppercase italic leading-tight">
                  {selectedGame.title}
                </h2>
                
                {/* --- УВЕЛИЧЕННЫЕ КНОПКИ ИЗДАНИЙ --- */}
                {editions.length > 1 && (
                  <div className="flex flex-wrap gap-3 p-2 bg-white/5 rounded-2xl border border-white/5 w-full max-w-md mx-auto">
                    {editions.map((edition: any, idx: number) => (
                      <button
                        key={edition.name}
                        onClick={() => setSelectedEditionIndex(idx)}
                        className={`flex-1 min-w-[140px] py-4 rounded-xl font-michroma text-[12px] uppercase transition-all tracking-wider ${
                          selectedEditionIndex === idx 
                            ? "bg-[#63f3f7] text-black shadow-[0_0_20px_rgba(99,243,247,0.4)]" 
                            : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {edition.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-center gap-4">
                  <span className="text-6xl font-michroma text-white tracking-tighter">
                    {currentEdition.price.toLocaleString()}
                  </span>
                  <span className="text-2xl text-[#63f3f7] font-michroma">₽</span>
                </div>

                {/* --- ЦЕНТРИРОВАННАЯ КНОПКА С УВЕЛИЧЕННЫМ ШРИФТОМ --- */}
                <div className="flex justify-center w-full">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    className={`relative group h-20 px-16 rounded-2xl font-michroma uppercase italic tracking-[0.2em] flex items-center justify-center gap-4 overflow-hidden border transition-all duration-500 backdrop-blur-md shadow-xl ${
                      isAdded 
                        ? "bg-[#63f3f7] text-black border-[#63f3f7] shadow-[0_0_30px_rgba(99,243,247,0.4)]" 
                        : "bg-white/5 border-white/10 text-[#63f3f7] hover:border-[#63f3f7]/50 hover:bg-[#63f3f7]/5"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <AnimatePresence mode="wait">
                      {isAdded ? (
                        <motion.div key="added" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
                          <Check size={28} strokeWidth={3} />
                          <span className="text-lg">ДОБАВЛЕНО</span>
                        </motion.div>
                      ) : (
                        <motion.div key="cart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
                          <ShoppingCart size={28} />
                          <span className="text-lg">В КОРЗИНУ</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 bg-black/40 border-t border-white/5 space-y-10">
              {screenshots.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {screenshots.slice(0, 3).map((img: string, i: number) => (
                    <div key={i} className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group bg-white/5">
                      <Image src={img} alt={`screenshot-${i}`} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" unoptimized />
                    </div>
                  ))}
                </div>
              )}
              <div className="max-w-4xl border-l-2 border-[#63f3f7]/30 pl-8 py-2 mx-auto">
                <p className="text-white/60 text-lg leading-relaxed font-light italic">
                  {description || "Описание временно отсутствует."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}