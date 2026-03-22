"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
}

export default function CartDrawer({ isOpen, onClose, items }: CartDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999]"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full md:w-[420px] bg-[#0a0a0b] border-r border-white/5 z-[1000] p-8 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Корзина</h2>
              <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-all">
                <X size={28} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-white/10 italic uppercase tracking-widest text-xs">
              <ShoppingCart size={48} className="mb-4 opacity-10" />
              Пусто
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}