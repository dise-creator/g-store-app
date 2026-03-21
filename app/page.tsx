"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// ВАЖНО: Добавили Pagination и EffectCoverflow
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules"; 
import { ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "@/components/GameCard";
import { useCartStore } from "../store/useCart";

// Импортируем все необходимые стили
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const GAMES = [
  { id: 1, title: "Starfield", price: 4200, discount: "-10%", image: "/images/starfield.jpg" },
  { id: 2, title: "Cyberpunk 2077", price: 2500, discount: "-50%", image: "/images/cyber.jpg" },
  { id: 3, title: "Elden Ring", price: 3900, discount: "-20%", image: "/images/elden.jpg" },
  { id: 4, title: "GTA V", price: 1200, discount: "-60%", image: "/images/gta.jpg" },
  { id: 5, title: "RDR 2", price: 2499, discount: "-33%", image: "/images/starfield.jpg" },
  { id: 6, title: "The Witcher 3", price: 1100, discount: "-70%", image: "/images/cyber.jpg" },
];

export default function Home() {
  const { searchQuery } = useCartStore();

  const filteredGames = GAMES.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Добавляем общий max-width и px, чтобы заголовок встал ровно
    <div className="max-w-[1400px] mx-auto px-6 py-10 min-h-screen overflow-hidden">
      
      {/* Шапка: Заголовок и Навигация в одном ряду */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black italic uppercase flex items-center gap-4 text-white">
          <span className="w-1.5 h-8 bg-[#a855f7] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          Лидеры продаж
        </h2>

        {/* Кастомные кнопки навигации (как в image_efc127.jpg) */}
        <div className="flex gap-2">
          <button className="swiper-button-prev-custom w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a855f7] hover:border-[#a855f7] transition-all group cursor-pointer">
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110" />
          </button>
          <button className="swiper-button-next-custom w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a855f7] hover:border-[#a855f7] transition-all group cursor-pointer">
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110" />
          </button>
        </div>
      </div>

      <div className="w-full relative">
        {filteredGames.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, EffectCoverflow]}
            effect={"coverflow"} // Включаем эффект
            grabCursor={true}
            centeredSlides={false} // Не центрируем, чтобы заполнить пустоту
            slidesPerView={"auto"} // Авто-ширина
            loop={true} // Бесконечный цикл для красоты
            
            // Настройки, чтобы смягчить 3D и убрать пустоту
            coverflowEffect={{
              rotate: 10, // Маленький угол поворота (не стена)
              stretch: -20, // Карточки немного наползают друг на друга
              depth: 50, // Небольшая глубина
              modifier: 1.2, // Мягкий усилитель
              slideShadows: false, // Отключаем жесткие тени Swiper
            }}
            
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            pagination={{ clickable: true }}
            className="!pb-14 w-full h-full !overflow-visible" // overflow-visible важен для 3D
          >
            {filteredGames.map((game, index) => (
              // Фиксированная ширина карточки для предсказуемого Coverflow
              <SwiperSlide key={game.id} style={{ width: '300px' }} className="!h-auto"> 
                {/* Обертка для плавного появления с задержкой */}
                <div 
                  className="animate-fade-in opacity-0 h-full" 
                  style={{ animationDelay: `${index * 80}ms` }}
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
