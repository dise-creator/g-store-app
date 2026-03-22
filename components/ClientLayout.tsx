"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";

// Добавляем типизацию для children, чтобы layout.tsx не ругался
interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  return (
    <>
      <Header 
        onSearchClick={() => setIsSearchOpen(true)} 
        onCartClick={() => setIsCartOpen(true)} // Теперь это заработает
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <main>{children}</main>
    </>
  );
}
