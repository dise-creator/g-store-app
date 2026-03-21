"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; 
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import SearchModal from "@/components/SearchModal";
import { useCartStore } from "../store/useCart";

import "swiper/css";

const GAMES = [
  { id: 1, title: "Starfield", price: 4200, image: "/images/starfield.jpg" },
  { id: 2, title: "Cyberpunk 2077", price: 2500, image: "/images/cyber.jpg" },
  { id: 3, title: "Elden Ring", price: 3900, image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, image: "/images/gta.jpg" },
  { id: 5, title: "RDR 2", price: 2499, image: "/images/rdr2.jpg" },
  { id: 6, title: "The Witcher 3", price: 1100, image: "/images/witcher.jpg" },
];

export default function Home() {
  const searchQuery = useCartStore((state) => state.searchQuery);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filteredGames = GAMES.filter((game) =>
    game.title.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  if (!mounted) return null;

  return (
    <main className="w-full min-h-screen bg-[#0a0a0b] pb-20">
      {/* Передаем функцию открытия модалки */}
      <Header onSearchClick={() => setIsSearchOpen(true)} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-32">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black italic uppercase flex items-center gap-4 text-white">
            <span className="w-1.5 h-8 bg-[#a855f7] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            Лидеры продаж
          </h2>
          <div className="flex gap-2">
            <button className="swiper-prev w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a855f7] transition-all disabled:opacity-10 active:scale-90">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button className="swiper-next w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a855f7] transition-all disabled:opacity-10 active:scale-90">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Контейнер Swiper без лишних паддингов */}
        <div className="w-full relative overflow-visible">
          {filteredGames.length > 0 ? (
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView="auto"
              navigation={{ prevEl: ".swiper-prev", nextEl: ".swiper-next" }}
              className="!overflow-visible"
            >
              {filteredGames.map((game) => (
                <SwiperSlide key={game.id} className="!w-[280px] !h-auto"> 
                  <GameCard {...game} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-white/20 text-center py-20 border border-dashed border-white/10 rounded-3xl">
              Ничего не найдено
            </div>
          )}
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <style jsx global>{`
        .swiper { overflow: visible !important; }
      `}</style>
    </main>
  );
}
