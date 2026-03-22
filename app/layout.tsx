"use client"; // Обязательно, так как используем useState

import React, { useState } from "react";
import { Unbounded } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal"; // Создадим его ниже

const unbounded = Unbounded({ 
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700", "900"],
  variable: "--font-unbounded",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <html lang="ru" className={unbounded.variable}>
      <body className="bg-[#0a0a0b] antialiased">
        {/* Передаем функцию открытия в Header */}
        <Header onSearchClick={() => setIsSearchOpen(true)} />
        
        <CartDrawer />
        
        {/* Само модальное окно поиска */}
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        
        {children}
      </body>
    </html>
  );
}