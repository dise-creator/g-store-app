"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";
import GameModal from "./GameModal"; // 1. Импортируем модалку
import { ALL_GAMES } from "@/store/games"; 
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
        games={ALL_GAMES} 
      />

      {/* Весь основной контент страниц */}
      <main className="relative min-h-screen">
        {children}
      </main>

      {/* 2. ГЛОБАЛЬНАЯ МОДАЛКА ИГРЫ 
        Ставим её в самый низ, чтобы она перекрывала всё, что выше в коде.
      */}
      <GameModal /> 
    </SessionProvider>
  );
}