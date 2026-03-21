"use client";

import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useCartStore } from "../store/useCart";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { searchQuery, setSearchQuery } = useCartStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-[#0a0a0b]/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#161920] border border-white/10 rounded-3xl shadow-2xl overflow-hidden shadow-[#a855f7]/10">
        <div className="p-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-[#a855f7]" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Какую игру ищем?"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-lg text-white focus:outline-none focus:border-[#a855f7]/50 transition-all"
            />
            <button onClick={onClose} className="absolute right-4 p-2 hover:bg-white/10 rounded-xl">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}