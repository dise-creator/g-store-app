"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star, PlayCircle } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";

export default function GameModal({ game, isOpen, onClose }: any) {
  const addItem = useCartStore((state) => state.addItem);

  if (!game) return null;

  const handleAddToCart = () => {
    addItem(game);
    onClose(); // Закрываем окно сразу после клика
  };

  // Пример ID трейлера
  const videoId = "8X2kIfS6fb8"; 

  return (
    <AnimatePresence>
      {isOpen && (
        // pt-48 — оптимальный отступ, ровно в 2 раза меньше предыдущего
        <div className="fixed inset-0 z-[150] flex justify-center items-start pt-48 px-6 pb-12 overflow-y-auto no-scrollbar">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Широкая премиальная модалка */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="relative w-full max-w-7xl bg-[#09090b] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)] flex flex-col lg:grid lg:grid-cols-12"
          >
            {/* Кнопка закрытия */}
            <button 
              onClick={onClose} 
              className="absolute top-8 right-10 z-50 p-2.5 bg-black/40 hover:bg-black/60 rounded-full text-white/30 hover:text-white transition-all border border-white/10 backdrop-blur-md"
            >
              <X size={24} />
            </button>

            {/* ЛЕВАЯ ЧАСТЬ: Видео (8 колонок) */}
            <div className="lg:col-span-8 relative bg-black aspect-video lg:aspect-auto lg:h-[580px]">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-[#09090b] hidden lg:block" />
            </div>

            {/* ПРАВАЯ ЧАСТЬ: Инфо + Постер (4 колонки) */}
            <div className="lg:col-span-4 p-10 flex flex-col justify-between border-l border-white/5">
              <div className="space-y-8">
                {/* Хедер карточки с мини-постером */}
                <div className="flex gap-5 items-center">
                  <div className="relative w-24 h-32 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/50">
                    <Image src={game.image} alt="poster" fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[#00FFFF] text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
                      <Star size={12} fill="#00FFFF" /> Highly Rated
                    </div>
                    <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">
                      {game.title}
                    </h2>
                  </div>
                </div>

                <div className="space-y-5">
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-5">
                    {game.description || "Официальный трейлер и подробности об издании. Окно теперь расположено с идеальным отступом от хедера, сохраняя баланс и удобство навигации."}
                  </p>
                  <div className="flex gap-2">
                    {['4K', 'VR Ready', 'Action'].map(t => (
                      <span key={t} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-white/20 uppercase border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Футер с кнопкой */}
              <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-white/20 text-[10px] uppercase font-black tracking-widest mb-0.5">Price</span>
                  <span className="text-4xl font-black text-white italic tracking-tighter">
                    {game.price} ₽
                  </span>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex items-center gap-3 px-10 py-4 bg-[#00FFFF] text-black rounded-[1.5rem] font-black uppercase italic hover:scale-105 active:scale-95 transition-all shadow-[0_15px_35px_rgba(0,255,255,0.25)]"
                >
                  <ShoppingCart size={20} />
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}