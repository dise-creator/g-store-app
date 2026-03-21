"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import GameCard from "@/components/GameCard";
import { useCartStore } from "../store/useCart";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const GAMES: Game[] = [
  { id: 1, title: "Starfield", price: 4200, discount: "-10%", image: "/images/starfield.jpg" },
  { id: 2, title: "Cyberpunk 2077", price: 2500, discount: "-50%", image: "/images/cyber.jpg" },
  { id: 3, title: "Elden Ring", price: 3900, discount: "-20%", image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, discount: "-60%", image: "/images/gta.jpg" },
  { id: 5, title: "RDR 2", price: 2499, discount: "-33%", image: "/images/starfield.jpg" }, // Временно рабочая
  { id: 6, title: "The Witcher 3", price: 1100, discount: "-70%", image: "/images/cyber.jpg" },    // Временно рабочая
  { id: 7, title: "God of War", price: 3500, discount: "-15%", image: "/images/starfield.jpg" },
  { id: 8, title: "Forza Horizon", price: 3000, discount: "-25%", image: "/images/cyber.jpg" },
];

export default function Home() {
  const { searchQuery } = useCartStore();

  const filteredGames = GAMES.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-6 py-10 max-w-[1520px] mx-auto min-h-screen">
      <h2 className="text-3xl font-black italic uppercase mb-10 flex items-center gap-4 text-white">
        <span className="w-2 h-10 bg-[#a855f7] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
        Лидеры продаж
      </h2>

      {/* Контейнер с принудительной высотой, чтобы Swiper не пропадал */}
      <div className="w-full relative min-h-[500px]"> 
        {filteredGames.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={filteredGames.length > 3}
            coverflowEffect={{
              rotate: 0,
              stretch: 80,   // Чуть уменьшил, чтобы точно влезли
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            className="w-full !overflow-visible py-10"
          >
            {filteredGames.map((game, index) => (
              <SwiperSlide key={game.id} style={{ width: '300px' }}>
                <div 
                  className="animate-fade-in opacity-0" 
                  style={{ 
                    animationDelay: `${index * 150}ms`, 
                    animationFillMode: 'forwards' 
                  }}
                >
                  <GameCard {...game} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-20 text-gray-500 font-bold uppercase opacity-30">
            Игры не найдены
          </div>
        )}
      </div>
    </div>
  );
}
