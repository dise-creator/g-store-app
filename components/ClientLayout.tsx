"use client";

import React, { useState, useEffect } from "react";
import Header from "./Header";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";
import GameModal from "./GameModal";
import Footer from "./Footer"; 
import { useGamesStore } from "@/store/games"; 
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();
  const allGames = useGamesStore((state) => state.allGames);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Предотвращаем гидратацию до полной загрузки клиента
  if (!mounted) return <div className="bg-[#0a0a0c] min-h-screen" />;

  return (
    <SessionProvider>
      {/* flex-col и min-h-screen гарантируют, что футер будет прижат к низу, 
        а isolate создает чистый контекст для z-index.
      */}
      <div className="relative flex flex-col min-h-screen bg-[#0a0a0c] text-white isolate overflow-x-hidden">
        
        {/* ХЕДЕР: Фиксируем сверху, чтобы он всегда был доступен (z-100) */}
        <div className="sticky top-0 z-[100] w-full">
          <Header 
            onSearchClick={() => setIsSearchOpen(true)} 
            onCartClick={() => setIsCartOpen(true)} 
            onWishlistClick={() => router.push('/wishlist')}
          />
        </div>

        {/* СЛУЖЕБНЫЕ ОКНА: Должны перекрывать контент, но быть под модалкой игры */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} games={allGames} />

        {/* ОСНОВНОЙ КОНТЕНТ: 
            flex-grow заставляет main занимать всё свободное место, отодвигая футер вниз.
            z-10 гарантирует, что карточки игр будут кликабельны и не "уйдут" под фон.
        */}
        <main className="relative z-10 flex-grow w-full">
          {children}
        </main>

        {/* ФУТЕР: Теперь он просто идет следом в потоке, без абсолютного позиционирования. */}
        <Footer />
        
        {/* МОДАЛЬНОЕ ОКНО ИГРЫ: Самый высокий приоритет отображения */}
        <GameModal /> 
      </div>
    </SessionProvider>
  );
}