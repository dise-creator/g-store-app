"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ShoppingCart, Info } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";

export default function GameModal({ game, isOpen, onClose }: any) {
  const addItem = useCartStore((state) => state.addItem);

  if (!game) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Контейнер модалки — УВЕЛИЧЕННЫЙ */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-6xl h-full max-h-[850px] bg-[#0f0f13] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
          >
            {/* ЛЕВАЯ ЧАСТЬ: Трейлер или Изображение */}
            <div className="relative w-full md:w-[60%] h-[300px] md:h-auto bg-black">
              {/* Если есть ссылка на видео (заглушка для примера) */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#0f0f13] to-transparent z-10" />
              <Image
                src={game.image}
                alt={game.title}
                fill
                className="object-cover opacity-60"
              />
              <button className="absolute inset-0 m-auto w-20 h-20 bg-[#00FFFF] rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform z-20 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                <Play fill="black" size={32} className="ml-1" />
              </button>
            </div>

            {/* ПРАВАЯ ЧАСТЬ: Контент */}
            <div className="flex-1 p-8 md:p-12 flex flex-col h-full overflow-hidden">
              <button 
                onClick={onClose}
                className="absolute top-6 right-8 text-white/20 hover:text-white transition-colors z-30"
              >
                <X size={32} />
              </button>

              <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[#00FFFF] font-black uppercase tracking-[0.3em] text-[10px]">
                      Official Store
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                      {game.title}
                    </h2>
                  </div>

                  <div className="flex gap-4">
                     <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/50">Action</span>
                     <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/50">RPG</span>
                  </div>

                  {/* СЮДА МОЖНО ВСТАВЛЯТЬ ОПИСАНИЕ */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase text-white/40 flex items-center gap-2">
                      <Info size={14} /> Об игре
                    </h4>
                    <p className="text-lg text-white/70 leading-relaxed font-medium">
                      Здесь будет твое очень длинное описание игры. Благодаря скроллу ты можешь вставить сюда хоть целую статью. 
                      Пользователь сможет удобно читать текст, не закрывая окно. Все элементы интерфейса останутся на своих местах.
                    </p>
                  </div>
                </div>
              </div>

              {/* НИЖНЯЯ ПАНЕЛЬ С ЦЕНОЙ */}
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Цена</span>
                  <span className="text-3xl font-black italic text-white">{game.price.toLocaleString()} ₽</span>
                </div>

                <button
                  onClick={() => {
                    addItem(game);
                    onClose();
                  }}
                  className="px-10 py-5 bg-[#00FFFF] text-black rounded-2xl font-black uppercase italic tracking-wider hover:scale-[1.05] active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,255,255,0.2)] flex items-center gap-3"
                >
                  <ShoppingCart size={20} strokeWidth={3} />
                  В корзину
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}