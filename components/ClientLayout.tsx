"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";
import GameModal from "./GameModal";
// ИЗМЕНЕНО: Импортируем хук useGamesStore вместо статичной переменной
import { useGamesStore } from "@/store/games"; 
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ДОБАВЛЕНО: Подписываемся на актуальный список игр из стора
  const allGames = useGamesStore((state) => state.allGames);

  return (
    <SessionProvider>
      <Header 
        onSearchClick={() => setIsSearchOpen(true)} 
        onCartClick={() => setIsCartOpen(true)} 
        onWishlistClick={() => router.push('/wishlist')}
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        // ИЗМЕНЕНО: Теперь передаем динамические данные вместо ALL_GAMES
        games={allGames} 
      />

      {/* Весь основной контент страниц */}
      <main className="relative min-h-screen">
        {children}
      </main>

      {/* 2. ГЛОБАЛЬНАЯ МОДАЛКА ИГРЫ */}
      <GameModal /> 
    </SessionProvider>
  );
}