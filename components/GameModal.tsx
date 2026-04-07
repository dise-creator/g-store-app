"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useGameModal } from "@/store/useGameModal";
import { useCartStore } from "@/store/useCart";
import { X, ShoppingCart, ChevronLeft, ChevronRight, Check, ShieldCheck, Zap } from "lucide-react";

export default function GameModal() {
  const { isOpen, selectedGame, closeModal } = useGameModal();
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedEditionIndex, setSelectedEditionIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedEditionIndex(0);
      setCurrentSlide(0);
      setIsAdded(false);
    }
  }, [isOpen, selectedGame]);

  // Проверка на наличие данных (Предотвращает падение приложения)
  if (!isOpen || !selectedGame) return null;

  // Безопасное получение данных через Optional Chaining и значения по умолчанию
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

    addItem({
      ...selectedGame,
      price: currentEdition.price,
      title: `${selectedGame.title} (${currentEdition.name})`
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={closeModal} />
      
      <div className="relative z-[210] w-full max-w-[1200px] h-full md:h-auto md:max-h-[90vh] bg-[#0d0d0f] md:border md:border-white/10 md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* Мобильная кнопка закрытия */}
        <button onClick={closeModal} className="absolute top-6 right-6 z-[250] md:hidden text-white/50"><X size={30}/></button>

        {/* ЛЕВАЯ ЧАСТЬ: Слайдер */}
        <div className="relative w-full md:w-[60%] h-[40vh] md:h-auto group bg-black">
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
          
          {screenshots.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#63f3f7] hover:text-black">
                <ChevronLeft size={28} />
              </button>
              <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#63f3f7] hover:text-black">
                <ChevronRight size={28} />
              </button>
              
              <div className="absolute bottom-10 left-10 flex gap-2">
                {screenshots.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-10 bg-[#63f3f7]" : "w-2 bg-white/20"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="flex flex-col flex-1 p-8 md:p-14 overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <h2 className="font-michroma text-3xl text-white uppercase tracking-tighter mb-4">{selectedGame?.title}</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6">{selectedGame?.shortDescription}</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                <ShieldCheck size={14} className="text-[#63f3f7]" />
                <span className="text-[9px] text-white/60 uppercase font-bold tracking-widest italic">Лицензионный ключ</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                <Zap size={14} className="text-[#63f3f7]" />
                <span className="text-[9px] text-white/60 uppercase font-bold tracking-widest italic">Моментальная выдача</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em] mb-4">Выберите издание</p>
            <div className="flex flex-col gap-3">
              {editions.map((edition, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedEditionIndex(index)}
                  className={`flex flex-col p-6 rounded-[2rem] border transition-all ${selectedEditionIndex === index ? "bg-white/5 border-[#63f3f7] shadow-[0_0_30px_rgba(99,243,247,0.1)]" : "border-white/5 hover:border-white/10"}`}
                >
                  <div className="flex justify-between items-center w-full mb-2">
                    <span className={`text-sm font-bold uppercase ${selectedEditionIndex === index ? "text-white" : "text-white/30"}`}>
                      {edition?.name}
                    </span>
                    <span className={`font-michroma text-xs ${selectedEditionIndex === index ? "text-[#63f3f7]" : "text-white/20"}`}>
                      {edition?.price?.toLocaleString() || 0} ₽
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {/* Используем Optional Chaining для массива features */}
                    {edition?.features?.map((feature, fIdx) => (
                      <span key={fIdx} className="text-[9px] text-white/20 uppercase tracking-tighter">
                         • {feature}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Итого к оплате</span>
              <div className="flex items-baseline gap-2">
                <span className="font-michroma text-4xl text-white">{currentEdition?.price?.toLocaleString() || 0}</span>
                <span className="text-[#63f3f7] font-michroma text-sm">₽</span>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className={`group relative w-full h-20 rounded-[1.5rem] flex items-center justify-center gap-4 transition-all ${isAdded ? "bg-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]" : "bg-[#63f3f7] hover:shadow-[0_0_40px_rgba(99,243,247,0.3)] active:scale-95"}`}
            >
              <div className={`flex items-center gap-4 transition-all duration-300 ${isAdded ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"}`}>
                <ShoppingCart size={20} className="text-black" />
                <span className="text-black font-black uppercase tracking-[0.2em] text-xs">Добавить в корзину</span>
              </div>
              
              <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300 ${isAdded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}>
                <Check size={20} className="text-white" />
                <span className="text-white font-black uppercase tracking-[0.2em] text-xs">Товар добавлен</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}