"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Header 
        onSearchClick={() => setIsSearchOpen(true)} 
        onCartClick={() => setIsCartOpen(true)} 
      />

      {/* Теперь мы не передаем items вручную, CartDrawer сам возьмет их из стора */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <main>{children}</main>
    </>
  );
}
