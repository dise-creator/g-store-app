"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules"; 
import { ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "./GameCard";
import { useCartStore } from "@/store/useCart";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

// Массив данных
const GAMES = [
  { id: 1, title: "Starfield", price: 4200, image: "/images/starfield.jpg" },
  { id: 2, title: "Cyberpunk 2077", price: 2500, image: "/images/cyber.jpg" },
  { id: 3, title: "Elden Ring", price: 3900, image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, image: "/images/gta.jpg" },
  { id: 5, title: "FIFA 24", price: 2499, image: "/images/fifa2024.jpg" },
  { id: 6, title: "Minecraft", price: 1100, image: "/images/mc.jpg" },
  { id: 7, title: "Starfield Premium", price: 5500, image: "/images/starfield.jpg" },
  { id: 8, title: "Cyberpunk Phantom", price: 3200, image: "/images/cyber.jpg" },
  { id: 9, title: "Elden DLC", price: 2100, image: "/images/elden.jpg" },
  { id: 10, title: "GTA Online Pack", price: 900, image: "/images/gta.jpg" },
  { id: 11, title: "FIFA Ultimate", price: 4500, image: "/images/fifa2024.jpg" },
  { id: 12, title: "Minecraft Dungeons", price: 1800, image: "/images/mc.jpg" },
];

export default function GameSlider() {
  const searchQuery = useCartStore((state) => state.searchQuery);
  const [mounted, setMounted] = useState(false);

  // Ждем монтирования, чтобы избежать Hydration Error
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredGames = GAMES.filter((game) =>
    game.title.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  // До монтирования не рендерим ничего, чтобы сервер и клиент не спорили
  if (!mounted) return <div className="min-h-[400px]" />;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black italic uppercase flex items-center gap-4 text-white">
          <span className="w-1.5 h-8 bg-[#a855f7] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          Результаты поиска
        </h2>
        
        <div className="flex gap-2">
          <button className="slider-prev w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a855f7] transition-all disabled:opacity-20 z-20 cursor-pointer">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button className="slider-next w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a855f7] transition-all disabled:opacity-20 z-20 cursor-pointer">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="w-full relative">
        {filteredGames.length > 0 ? (
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={20}
            slidesPerView={2}
            freeMode={true}
            loop={filteredGames.length > 6}
            navigation={{ prevEl: ".slider-prev", nextEl: ".slider-next" }}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            className="w-full !pb-10 !overflow-visible"
          >
            {filteredGames.map((game, index) => (
              <SwiperSlide key={game.id} className="h-auto"> 
                <div 
                  className="animate-card-fade" 
                  style={{ 
                    animationDelay: `${index * 80}ms`,
                    willChange: "transform, opacity" 
                  }}
                >
                  <GameCard {...game} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-white/20 text-center py-20 border border-dashed border-white/10 rounded-3xl">
            Ничего не найдено
          </div>
        )}
      </div>
    </section>
  );
}