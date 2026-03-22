"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import Image from "next/image";

const GAMES = [
  { id: 1, title: "СТАРФИЛД", price: 4200, image: "/images/starfield.jpg" },
  { id: 2, title: "КИБЕРПАНК 2077", price: 2500, image: "/images/cyber.jpg" },
  { id: 3, title: "ЭЛДЕН РИНГ", price: 3900, image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, image: "/images/gta.jpg" },
  { id: 5, title: "FIFA 24", price: 2499, image: "/images/fifa2024.jpg" },
  { id: 6, title: "ШАХТЕРСКОЕ РЕМЕСЛО", price: 1100, image: "/images/mc.jpg" },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [localQuery, setLocalQuery] = useState("");
  const addItem = useCartStore((state) => state.addItem);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setLocalQuery("");
    onClose();
  };

  const filteredResults = useMemo(() => {
    if (localQuery.length < 2) return [];
    return GAMES.filter((game) =>
      game.title.toLowerCase().includes(localQuery.toLowerCase())
    );
  }, [localQuery]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-[#0a0a0b]/95 backdrop-blur-2xl p-6 pt-24 flex justify-center"
        >
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative mb-8">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#a855f7] w-6 h-6" />
              <input
                ref={inputRef}
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Поиск по названию..."
                className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-5 pl-16 pr-6 text-xl text-white outline-none focus:border-[#a855f7]/50 transition-all"
              />
              <button onClick={handleClose} className="absolute -right-12 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                <X size={32} />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredResults.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center gap-4 p-3 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-[#a855f7]/10 transition-all group"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={game.image} alt={game.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-black italic uppercase text-sm">{game.title}</h4>
                    <p className="text-[#a855f7] font-black">{game.price.toLocaleString()} ₽</p>
                  </div>
                  <button 
                    onClick={() => { addItem(game); handleClose(); }}
                    className="p-3 bg-[#a855f7] rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}