"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import GameCard from "./GameCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const ALL_GAMES = [
  { id: 1, title: "СТАРФИЛД", price: 4200, image: "/images/starfield.jpg" },
  { id: 2, title: "КИБЕРПАНК 2077", price: 2500, image: "/images/cyber.jpg" },
  { id: 3, title: "ЭЛДЕН РИНГ", price: 3900, image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, image: "/images/gta.jpg" },
  { id: 5, title: "FIFA 24", price: 2499, image: "/images/fifa2024.jpg" },
  { id: 6, title: "MINECRAFT", price: 1100, image: "/images/mc.jpg" },
];

export default function GameSlider() {
  return (
    <section className="relative w-full py-10 bg-[#0a0a0b] select-none">
      {/* Контейнер ограничивает контент по центру, но мы разрешаем Swiper вылезать за его пределы */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={20}
          slidesPerView={1.2}
          freeMode={true}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4.5 },
          }}
          // !overflow-visible нужен, чтобы карточки красиво уходили за край контейнера 1400px
          className="w-full !overflow-visible !pb-14"
        >
          {ALL_GAMES.map((game) => (
            <SwiperSlide key={game.id} className="h-auto">
              <GameCard {...game} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        /* Стили кнопок навигации под твой макет */
        .swiper-button-next,
        .swiper-button-prev {
          color: #a855f7 !important;
          background: rgba(18, 24, 32, 0.9);
          backdrop-filter: blur(10px);
          width: 44px !important;
          height: 44px !important;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          top: -45px !important; /* Поднимаем над слайдером к заголовку */
          transition: all 0.3s ease;
        }

        .swiper-button-prev {
          left: auto !important;
          right: 65px !important;
        }

        .swiper-button-next {
          right: 15px !important;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px !important;
          font-weight: bold;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #a855f7;
          color: white !important;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
        }
      `}</style>
    </section>
  );
}