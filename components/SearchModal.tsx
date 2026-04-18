"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";
import { useRegionStore } from "@/store/useRegion";
import { useGameModal } from "@/store/useGameModal";
import { getActiveDiscount, getDiscountedPrice, type Game } from "@/store/games";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
}

const searchMap: Record<string, string> = {
  "Cyberpunk 2077": "Киберпанк 2077 cp77",
  "Counter-Strike 2": "Контр Страйк 2 кс cs cs2",
  "Minecraft": "Майнкрафт mc мс",
  "Elden Ring": "Элден Ринг",
  "GTA V": "ГТА 5 gta 5 gta5",
  "Starfield": "Старфилд",
};

const HISTORY_KEY = "clic-search-history";

export default function SearchModal({ isOpen, onClose, games = [] }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { addItem, items } = useCartStore();
  const { getPrice } = useRegionStore();
  const openModal = useGameModal((state) => state.openModal);

  const isInCart = (gameId: string) => items.some(item => String(item.id) === String(gameId));

  // Загружаем историю из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Фокус при открытии
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearchQuery("");
    }
  }, [isOpen]);

  // ESC закрывает
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Сохраняем в историю
  const saveToHistory = (query: string) => {
    if (!query.trim()) return;
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const removeFromHistory = (item: string) => {
    const newHistory = history.filter(h => h !== item);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const handleGameClick = (game: Game) => {
    saveToHistory(game.title);
    openModal(game);
    onClose();
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    inputRef.current?.focus();
  };

  const clean = (str: string) =>
    str.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim();

  const searchResults = useMemo(() => {
    const query = clean(searchQuery);
    if (query.length === 0) return [];
    return games
      .filter((game) => {
        const mainTitle = clean(game.title);
        const mapped = clean(searchMap[game.title] || "");
        return mainTitle.includes(query) || mapped.includes(query);
      })
      .sort((a, b) => {
        const aStarts = clean(a.title).startsWith(query);
        const bStarts = clean(b.title).startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      });
  }, [searchQuery, games]);

  // Популярные — топ 6 случайных игр
  const popularGames = useMemo(() =>
    [...games].sort(() => 0.5 - Math.random()).slice(0, 6),
    [games]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Оверлей */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-xl"
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[160] w-full max-w-[860px] mx-auto bg-[#0d0d0f] border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Строка поиска */}
            <div className="flex items-center gap-4 p-6 border-b border-white/5">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#63f3f7]" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Найти игру..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#63f3f7]/40 rounded-2xl py-4 pl-12 pr-4 text-white text-base outline-none transition-all font-bold italic tracking-tight placeholder:text-white/20"
                />
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase"
              >
                ESC
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar">

              {/* Результаты поиска */}
              {searchQuery.length > 0 && (
                <div>
                  {searchResults.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {searchResults.map((game) => {
                        const added = isInCart(game.id);
                        const discount = getActiveDiscount(game);
                        const basePrice = discount > 0 ? getDiscountedPrice(game) : game.price;
                        const displayPrice = getPrice(basePrice);

                        return (
                          <motion.div
                            layout
                            key={game.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between bg-white/[0.03] border border-white/5 hover:border-[#63f3f7]/20 rounded-2xl p-3 transition-all group cursor-pointer"
                            onClick={() => handleGameClick(game)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-white/5 shrink-0">
                                <Image src={game.image} alt={game.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                              </div>
                              <div>
                                <h3 className="text-sm font-black uppercase italic text-white leading-none mb-1">{game.title}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-[#63f3f7] text-xs font-black">{displayPrice.toLocaleString()} ₽</p>
                                  {discount > 0 && (
                                    <span className="text-[8px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded-lg">-{discount}%</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); !added && addItem({ ...game, price: displayPrice }); }}
                              className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic transition-all ${
                                added
                                  ? "bg-[#63f3f7] text-black"
                                  : "bg-white/5 text-white/40 border border-white/5 hover:bg-[#63f3f7]/20 hover:text-[#63f3f7]"
                              }`}
                            >
                              {added ? "✓" : "В корзину"}
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-white/10 uppercase italic font-black text-2xl tracking-tighter">Ничего не найдено</p>
                      <p className="text-white/5 text-xs uppercase mt-2 tracking-widest">Попробуй другое название</p>
                    </div>
                  )}
                </div>
              )}

              {/* Пустой поиск — показываем историю и популярные */}
              {searchQuery.length === 0 && (
                <div className="flex flex-col gap-8">

                  {/* История поиска */}
                  {history.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock size={14} className="text-white/20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Недавно искали</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {history.map((item) => (
                          <div key={item} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-all group">
                            <button
                              onClick={() => handleHistoryClick(item)}
                              className="flex items-center gap-3 flex-1 text-left"
                            >
                              <SearchIcon size={14} className="text-white/20" />
                              <span className="text-white/50 text-sm font-bold italic group-hover:text-white transition-colors">{item}</span>
                            </button>
                            <button
                              onClick={() => removeFromHistory(item)}
                              className="text-white/10 hover:text-white/40 transition-colors p-1"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Популярные игры — сетка карточек */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={14} className="text-[#63f3f7]" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Популярные игры</p>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {popularGames.map((game) => {
                        const discount = getActiveDiscount(game);
                        const basePrice = discount > 0 ? getDiscountedPrice(game) : game.price;
                        const displayPrice = getPrice(basePrice);

                        return (
                          <motion.button
                            key={game.id}
                            onClick={() => handleGameClick(game)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex flex-col gap-2 group"
                          >
                            {/* Обложка */}
                            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/5 group-hover:border-[#63f3f7]/30 transition-all bg-[#161618]">
                              <Image src={game.image} alt={game.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                              {discount > 0 && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-lg">
                                  -{discount}%
                                </div>
                              )}
                            </div>
                            {/* Название и цена */}
                            <div className="px-0.5">
                              <p className="text-white/60 text-[8px] uppercase font-black italic truncate group-hover:text-white transition-colors leading-tight">
                                {game.title}
                              </p>
                              <p className="text-[#63f3f7] text-[9px] font-black mt-0.5">
                                {displayPrice.toLocaleString()} ₽
                              </p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}