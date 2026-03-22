"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCart";
import { X, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Темная подложка */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Сама корзина (теперь слева) */}
          <motion.div
            initial={{ x: "-100%" }} // Выезд слева
            animate={{ x: 0 }}
            exit={{ x: "-100%" }} // Уход влево
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full max-w-[400px] bg-[#13151a] border-r border-white/10 shadow-[20px_0_40px_rgba(0,0,0,0.5)] z-[101] p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase italic text-white flex items-center gap-3">
                <ShoppingBag className="text-[#a855f7]" /> Корзина
              </h2>
              <button onClick={toggleCart} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="text-white/50 hover:text-white" />
              </button>
            </div>

            {/* Список товаров */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {items.length > 0 ? (
                items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }} // Появление элементов тоже с небольшим сдвигом слева
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    key={item.id} 
                    className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 group"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-white font-bold text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-[#a855f7] font-black">{item.price} ₽</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/20">
                  <ShoppingBag size={64} className="mb-4 opacity-10" />
                  <p>Тут пока пусто</p>
                </div>
              )}
            </div>

            {/* Футер */}
            {items.length > 0 && (
              <div className="pt-6 border-t border-white/10 mt-auto">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-white/50 uppercase text-xs font-bold">Итого:</span>
                  <span className="text-3xl font-[1000] text-white italic">
                    {items.reduce((acc, item) => acc + item.price, 0).toLocaleString()} ₽
                  </span>
                </div>
                <button className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-4 rounded-2xl font-black uppercase italic shadow-[0_10px_20px_rgba(168,85,247,0.3)] transition-all active:scale-95">
                  Оформить заказ
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}