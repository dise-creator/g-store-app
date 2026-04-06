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
    if (isOpen && selectedGame) {
      console.log("Данные игры в модалке:", selectedGame);
    }
    setSelectedEditionIndex(0);
    setIsAdded(false);
  }, [isOpen, selectedGame]);

  if (!selectedGame) return null;

  // Безопасное получение данных, учитывая разные форматы именования (DB vs Interface)
  const editions = selectedGame.editions || [];
  const screenshots = selectedGame.screenshots || [];
  
  // Проверяем все возможные варианты полей описания
  const description = 
    selectedGame.fullDescription || 
    (selectedGame as any).full_description || 
    selectedGame.shortDescription || 
    (selectedGame as any).description;

  const currentEdition = editions.length > 0 
    ? editions[selectedEditionIndex] 
    : { name: "Standard", price: selectedGame.price };

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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeModal} className="absolute inset-0 cursor-pointer" 
          />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-5xl bg-[#0d0e12] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col pointer-events-auto shadow-2xl"
          >
            <button onClick={closeModal} className="absolute top-6 right-6 z-50 text-white/20 hover:text-white transition-colors">
              <X size={32} />
            </button>

            {/* ВЕРХНЯЯ СЕКЦИЯ */}
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-2/5 aspect-[3/4] md:aspect-auto min-h-[400px]">
                <Image 
                  src={selectedGame.image} 
                  alt={selectedGame.title} 
                  fill 
                  className="object-cover" 
                  unoptimized 
                />
              </div>

              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-6">
                <h2 className="text-4xl md:text-5xl font-michroma text-white uppercase italic leading-tight">
                  {selectedGame.title}
                </h2>
                
                {/* ВЫБОР ИЗДАНИЯ */}
                {editions.length > 0 && (
                  <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                    {editions.map((edition: any, idx: number) => (
                      <button
                        key={edition.name}
                        onClick={() => setSelectedEditionIndex(idx)}
                        className={`flex-1 py-3 rounded-xl font-michroma text-[10px] uppercase transition-all ${
                          selectedEditionIndex === idx ? "bg-[#63f3f7] text-black" : "text-white/40 hover:text-white"
                        }`}
                      >
                        {edition.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-5xl font-michroma text-white">
                    {Number(currentEdition.price).toLocaleString()}
                  </span>
                  <span className="text-xl text-[#63f3f7] font-michroma">₽</span>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`w-full h-20 rounded-2xl font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 ${
                    isAdded ? "bg-green-500 text-white" : "bg-[#63f3f7] text-black hover:scale-[1.02]"
                  }`}
                >
                  {isAdded ? <Check size={24} /> : <ShoppingCart size={24} />}
                  <span>{isAdded ? "ДОБАВЛЕНО" : "В КОРЗИНУ"}</span>
                </button>
              </div>
            </div>

            {/* НИЖНЯЯ СЕКЦИЯ (Скриншоты и Описание) */}
            <div className="p-8 md:p-12 bg-black/40 border-t border-white/5 space-y-10">
              {screenshots.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {screenshots.map((img: string, i: number) => (
                    <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group bg-white/5">
                      <Image 
                        src={img} 
                        alt="screenshot" 
                        fill 
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        unoptimized 
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="max-w-3xl border-l-2 border-[#63f3f7]/30 pl-8">
                <p className="text-white/50 text-lg italic leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}