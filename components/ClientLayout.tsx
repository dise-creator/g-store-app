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

  // Исправляет ошибку Hydration Error
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-[#0a0a0c] min-h-screen" />;

  return (
    <SessionProvider>
      {/* Обертка flex-col позволяет прижать футер к низу */}
      <div className="flex flex-col min-h-screen bg-[#0a0a0c]">
        
        <Header 
          onSearchClick={() => setIsSearchOpen(true)} 
          onCartClick={() => setIsCartOpen(true)} 
          onWishlistClick={() => router.push('/wishlist')}
        />

        {/* Модальные окна */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} games={allGames} />

        {/* pb-16 — уменьшенный в 2.5 раза отступ снизу основного контента */}
        <main className="relative flex-grow pb-16">
          {children}
        </main>

        {/* Плавающий футер-остров */}
        <Footer />
        
        {/* Глобальное окно подробностей игры */}
        <GameModal /> 
      </div>
    </SessionProvider>
  );
}