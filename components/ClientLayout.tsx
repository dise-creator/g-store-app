"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Теперь Header точно знает, что такое onSearchClick */}
      <Header onSearchClick={() => setIsSearchOpen(true)} />

      <CartDrawer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Весь контент страниц (children) попадает сюда */}
      {children}
    </>
  );
}
