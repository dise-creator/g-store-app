"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules"; 
import { ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "@/components/GameCard";
import { useCartStore } from "../store/useCart";

import "swiper/css";
import "swiper/css/free-mode";

const GAMES = [
  { id: 1, title: "Starfield", price: 4200, image: "/images/starfield.jpg" },
  { id: 2, title: "Cyberpunk 2077", price: 2500, image: "/images/cyber.jpg" },
  { id: 3, title: "Elden Ring", price: 3900, image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, image: "/images/gta.jpg" },
  { id: 5, title: "FIFA 24", price: 2499, image: "/images/fifa2024.jpg" }, 
  { id: 6, title: "Minecraft", price: 1100, image: "/images/mc.jpg" },
];

export default function Home() {
  const searchQuery = useCartStore((state) => state.searchQuery);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filteredGames = GAMES.filter((game) =>
    game.title.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  if (!mounted) return null;

  return (
    // Добавили overflow-x-hidden прямо на main для страховки
    <main className="w-full min-h-screen bg-[#0a0a0b] pb-20 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-32">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black italic uppercase flex items-center gap-4 text-white">
            <span className="w-1.5 h-8 bg-[#a855f7] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            Результаты поиска
          </h2>
          <div className="flex gap-2">
            <button className="swiper-prev w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a855f7] transition-all disabled:opacity-30">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button className="swiper-next w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a855f7] transition-all disabled:opacity-30">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="w-full relative">
          {filteredGames.length > 0 ? (
            <Swiper
              modules={[Navigation, FreeMode]}
              spaceBetween={24}
              slidesPerView="auto"
              freeMode={true}
              navigation={{ prevEl: ".swiper-prev", nextEl: ".swiper-next" }}
              // Удалили !overflow-visible из className
              className="w-full !pb-10" 
            >
              {filteredGames.map((game) => (
                <SwiperSlide key={game.id} className="!w-[280px] h-auto"> 
                  <GameCard {...game} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-white/20 text-center py-20 border border-dashed border-white/10 rounded-3xl">
              По запросу "{searchQuery}" игр не найдено.
            </div>
          )}
        </div>
      </div>

      {/* УДАЛИЛИ ПРЕДЫДУЩИЙ БЛОК style jsx global С OVERFLOW: VISIBLE */}
    </main>
  );
}
