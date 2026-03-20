"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import GameCard from "./GameCard";

// Импорт стилей
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function GameSlider({ games }: { games: any[] }) {
  return (
    <section className="py-10 select-none">
      <Swiper
        modules={[Navigation, Pagination, FreeMode]}
        spaceBetween={20}
        slidesPerView={1.2}
        freeMode={true}
        grabCursor={true}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="!pb-14 !px-4"
      >
        {games.map((game) => (
          <SwiperSlide key={game.id}>
            <GameCard {...game} />
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: #3b82f6 !important;
          background: rgba(18, 24, 32, 0.8);
          backdrop-filter: blur(10px);
          width: 50px !important;
          height: 50px !important;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          background: #3b82f6;
          color: white !important;
        }
        .swiper-pagination-bullet {
          background: #3b82f6 !important;
        }
      `}</style>
    </section>
  );
}