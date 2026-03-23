"use client";

import React, { useState } from "react";
import Header from "./Header";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";
import { ALL_GAMES } from "@/store/games"; // Убедись, что путь к играм верный
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <SessionProvider>
      {/* Исправляем пропсы хедера */}
      <Header 
        onSearchClick={() => setIsSearchOpen(true)} 
        onCartClick={() => setIsCartOpen(true)} 
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* ОБЯЗАТЕЛЬНО передаем массив games */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        games={ALL_GAMES} 
      />

      <main>{children}</main>
    </SessionProvider>
  );
}