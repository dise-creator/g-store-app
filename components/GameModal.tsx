"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useGameModal } from "@/store/useGameModal";
import { useCartStore } from "@/store/useCart";
import { X, ShoppingCart, ChevronLeft, ChevronRight, Check, ShieldCheck, Zap, CreditCard } from "lucide-react";

const PSIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.998.636.2.76.893.76 1.582v5.815c2.77 1.397 4.851-.29 4.851-3.652 0-3.5-1.201-5.135-4.851-6.457 0 0-3.143-1.012-5.469-1.382zm-4.732 14.5c-2.361-.766-2.75-2.355-1.674-3.27.981-.858 2.639-1.491 2.639-1.491l.01 2.86s-1.016.35-1.534.668c-.519.319-.525.757.108.98.894.315 1.813.162 1.813.162v2.005s-.407.08-.928.08c-.961 0-2.153-.26-2.974-.77l.54-.224zm11.49 1.639l-4.223-1.362v-2.15l4.223 1.487v2.025z"/>
  </svg>
);

const PSNCard = ({ value, animate }: { value: number; animate: boolean }) => (
  <motion.div
    initial={animate ? { scale: 1, y: 0, opacity: 1, rotate: 0 } : false}
    animate={animate ? {
      scale: [1, 1.2, 0.8, 1.5, 0],
      y: [0, -20, -10, -60, -120],
      opacity: [1, 1, 1, 0.5, 0],
      rotate: [0, -5, 5, -10, 15],
    } : {}}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative w-40 h-24 rounded-2xl overflow-hidden shadow-2xl"
    style={{ background: "linear-gradient(135deg, #003087 0%, #0070d1 50%, #00439c 100%)" }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
    <div className="absolute top-2 right-2">
      <PSIcon className="w-7 h-7 text-white/80" />
    </div>
    <div className="absolute bottom-2 left-3">
      <p className="text-white/50 text-[7px] uppercase font-black tracking-widest">PlayStation Network</p>
      <p className="text-white font-black text-lg">{value.toLocaleString()} ₽</p>
    </div>
    <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/5" />
    <div className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full bg-white/5" />
  </motion.div>
);

export default function GameModal() {
  const { isOpen, selectedGame, closeModal } = useGameModal();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedEditionIndex, setSelectedEditionIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [showCardAnimation, setShowCardAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedEditionIndex(0);
      setCurrentSlide(0);
      setIsAdded(false);
      setShowCardAnimation(false);
    }
  }, [isOpen, selectedGame]);

  if (!isOpen || !selectedGame) return null;

  const screenshots = selectedGame?.screenshots?.length > 0
    ? selectedGame.screenshots
    : [selectedGame?.image || ""];

  const editions = selectedGame?.editions?.length > 0
    ? selectedGame.editions
    : [{ name: "Standard Edition", price: selectedGame?.price || 0, features: ["Базовая игра"] }];

  const currentEdition = editions[selectedEditionIndex] || editions[0];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);

  const handleAddToCart = () => {
    if (!selectedGame || !currentEdition) return;
    setShowCardAnimation(true);
    setTimeout(() => {
      addItem({
        ...selectedGame,
        price: currentEdition.price,
        title: `${selectedGame.title} (${currentEdition.name})`
      });
      setIsAdded(true);
      setShowCardAnimation(false);
    }, 800);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={closeModal} />

      <div className="relative z-[210] w-full max-w-[1100px] h-full md:h-auto bg-[#0d0d0f] md:border md:border-white/10 md:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">

        <button onClick={closeModal} className="absolute top-4 right-4 z-[250] md:hidden text-white/50">
          <X size={28} />
        </button>

        {/* Десктопная кнопка закрытия */}
        <button onClick={closeModal} className="absolute top-5 right-5 z-[250] hidden md:flex w-10 h-10 items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/40 hover:text-white transition-all">
          <X size={18} />
        </button>

        {/* ЛЕВАЯ ЧАСТЬ: Слайдер */}
        <div className="relative w-full md:w-[52%] h-[35vh] md:h-auto group bg-black shrink-0">
          {screenshots[currentSlide] && (
            <Image
              key={currentSlide}
              src={screenshots[currentSlide]}
              alt="Gameplay"
              fill
              className="object-cover transition-all duration-700 ease-in-out"
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {screenshots.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#63f3f7] hover:text-black">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#63f3f7] hover:text-black">
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-6 left-6 flex gap-2">
                {screenshots.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-8 bg-[#63f3f7]" : "w-2 bg-white/20"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ПРАВАЯ ЧАСТЬ — компактная, без скролла */}
        <div className="flex flex-col flex-1 p-6 md:p-8 overflow-hidden">

          {/* Бейджи */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#003087]/20 border border-[#003087]/40 rounded-lg">
              <PSIcon className="w-3.5 h-3.5 text-[#0070d1]" />
              <span className="text-[8px] text-[#0070d1] uppercase font-black tracking-widest">PS5</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
              <ShieldCheck size={11} className="text-[#63f3f7]" />
              <span className="text-[8px] text-white/50 uppercase font-bold tracking-widest">Карта пополнения</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
              <Zap size={11} className="text-[#63f3f7]" />
              <span className="text-[8px] text-white/50 uppercase font-bold tracking-widest">Моментально</span>
            </div>
          </div>

          {/* Заголовок */}
          <h2 className="font-black italic uppercase text-4xl md:text-5xl text-white tracking-tighter leading-none mb-1">
            {selectedGame?.title}
          </h2>
          <p className="text-white/30 text-xs leading-relaxed mb-4 line-clamp-2">{selectedGame?.shortDescription}</p>

          {/* Выбор издания */}
          <p className="text-[9px] text-white/20 uppercase font-black tracking-[0.3em] mb-2">Выберите вариант</p>
          <div className="flex flex-col gap-2 mb-4">
            {editions.map((edition, index) => (
              <button
                key={index}
                onClick={() => setSelectedEditionIndex(index)}
                className={`flex flex-col p-4 rounded-2xl border transition-all text-left ${
                  selectedEditionIndex === index
                    ? "bg-white/5 border-[#63f3f7] shadow-[0_0_20px_rgba(99,243,247,0.1)]"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-sm font-black uppercase italic ${selectedEditionIndex === index ? "text-white" : "text-white/30"}`}>
                    {edition?.name}
                  </span>
                  <span className={`font-black text-base ${selectedEditionIndex === index ? "text-[#63f3f7]" : "text-white/20"}`}>
                    {edition?.price?.toLocaleString() || 0} ₽
                  </span>
                </div>

                {edition?.cards && edition.cards.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {edition.cards.map((card, cIdx) => (
                      <div key={cIdx} className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[9px] font-black ${selectedEditionIndex === index ? "bg-[#63f3f7]/10 border-[#63f3f7]/20 text-[#63f3f7]" : "bg-white/[0.03] border-white/5 text-white/20"}`}>
                        <CreditCard size={9} />
                        {card.quantity > 1 && <span>{card.quantity}×</span>}
                        <span>PSN {card.value.toLocaleString()} ₽</span>
                      </div>
                    ))}
                  </div>
                )}

                {(!edition?.cards || edition.cards.length === 0) && (
                  <div className="flex flex-wrap gap-x-3 mt-1">
                    {edition?.features?.map((feature, fIdx) => (
                      <span key={fIdx} className="text-[8px] text-white/20 uppercase">• {feature}</span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Инструкция — горизонтальная компактная */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            {[
              { step: "1", text: "Купи карту PSN" },
              { step: "2", text: "Получи код" },
              { step: "3", text: "Активируй в PS Store" },
            ].map((item, i) => (
              <React.Fragment key={item.step}>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-4 h-4 rounded-full bg-[#63f3f7]/10 border border-[#63f3f7]/20 flex items-center justify-center">
                    <span className="text-[#63f3f7] text-[7px] font-black">{item.step}</span>
                  </div>
                  <span className="text-white/30 text-[9px] font-bold whitespace-nowrap">{item.text}</span>
                </div>
                {i < 2 && <div className="w-4 h-px bg-white/10 shrink-0" />}
              </React.Fragment>
            ))}
          </div>

          {/* Итого и кнопка */}
          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest block">Итого к оплате</span>
                {currentEdition?.cards && (
                  <span className="text-[8px] text-white/20 mt-0.5 block">
                    {currentEdition.cards.map(c => `${c.quantity > 1 ? c.quantity + "×" : ""}PSN ${c.value.toLocaleString()}₽`).join(" + ")}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-black italic text-4xl text-white">{currentEdition?.price?.toLocaleString() || 0}</span>
                <span className="text-[#63f3f7] font-black text-lg">₽</span>
              </div>
            </div>

            <div className="relative">
              <AnimatePresence>
                {showCardAnimation && currentEdition?.cards && (
                  <div className="absolute inset-0 flex items-center justify-center gap-3 z-10 pointer-events-none">
                    {currentEdition.cards.map((card, idx) => (
                      <PSNCard key={idx} value={card.value} animate={showCardAnimation} />
                    ))}
                  </div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={handleAddToCart}
                disabled={showCardAnimation}
                whileTap={{ scale: 0.97 }}
                className={`group relative w-full h-16 rounded-2xl flex items-center justify-center gap-3 transition-all overflow-hidden ${
                  isAdded ? "bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                  : showCardAnimation ? "bg-[#63f3f7]/50 cursor-wait"
                  : "bg-[#63f3f7] hover:shadow-[0_0_30px_rgba(99,243,247,0.3)]"
                }`}
              >
                <div className={`flex items-center gap-3 transition-all duration-300 ${isAdded || showCardAnimation ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"}`}>
                  <ShoppingCart size={18} className="text-black" />
                  <span className="text-black font-black uppercase tracking-[0.2em] text-xs">Добавить в корзину</span>
                </div>
                <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300 ${showCardAnimation ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}>
                  <CreditCard size={18} className="text-black animate-bounce" />
                  <span className="text-black font-black uppercase tracking-[0.2em] text-xs">Добавляем...</span>
                </div>
                <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300 ${isAdded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}>
                  <Check size={18} className="text-white" />
                  <span className="text-white font-black uppercase tracking-[0.2em] text-xs">Товар добавлен!</span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}