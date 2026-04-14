"use client";

import React, { useState } from "react";
import Header from "./Header";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";
import GameModal from "./GameModal";
import Footer from "./Footer";
import { useGamesStore } from "@/store/games";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const router = useRouter();
  const allGames = useGamesStore((state) => state.allGames);

  return (
    <SessionProvider>
      <div className="relative flex flex-col min-h-screen bg-[#0a0a0c] text-white isolate overflow-x-hidden">
        
        {/* HEADER */}
        <div className="sticky top-0 z-[100] w-full">
          <Header
            onSearchClick={() => setIsSearchOpen(true)}
            onCartClick={() => setIsCartOpen(true)}
            onWishlistClick={() => router.push("/wishlist")}
          />
        </div>

        {/* DRAWERS / MODALS */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          games={allGames}
        />

        {/* MAIN */}
        <main className="relative z-10 flex-grow w-full">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />

        {/* GAME MODAL (всегда поверх всего) */}
        <div className="fixed inset-0 z-[999] pointer-events-none">
          <div className="pointer-events-auto">
            <GameModal />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}