"use client";

import React, { useState } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Управление модалкой поиска
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <html lang="ru">
      <body className="antialiased bg-[#0a0a0b] text-white flex flex-col min-h-screen">
        
        {/* Передаем обязательные пропсы в модалку */}
        <SearchModal 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
        
        {/* Передаем функцию открытия в шапку */}
        <Header onSearchClick={() => setIsSearchOpen(true)} />
        
        <CartDrawer /> 
        
        {/* Отступ pt-24 уже есть внутри page.tsx, поэтому тут просто flex-grow */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}