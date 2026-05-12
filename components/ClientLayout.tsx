"use client";

import React, { useEffect } from "react";
import Header from "./Header";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";
import GameModal from "./GameModal";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import { useGamesStore } from "@/store/games";
import { SessionProvider } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useRegionStore } from "@/store/useRegion";
import { motion, AnimatePresence } from "framer-motion";
import { useTelegramAuth } from "../hooks/useTelegramAuth";
import { useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const allGames = useGamesStore((state) => state.allGames);
  const fetchRates = useRegionStore((state) => state.fetchRates);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    const handler = () => setIsCartOpen(true);
    window.addEventListener("openCart", handler);
    return () => window.removeEventListener("openCart", handler);
  }, []);

  return (
    <SessionProvider>
      <TelegramAuthProvider />
      <div className="relative flex flex-col min-h-screen text-white isolate overflow-x-hidden">
        <div className="sticky top-0 z-[100] w-full">
          <Header
            onSearchClick={() => setIsSearchOpen(true)}
            onCartClick={() => setIsCartOpen(true)}
            onWishlistClick={() => router.push("/wishlist")}
          />
        </div>

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          games={allGames}
        />

        <RatesLoader />

        <main className="relative z-10 flex-grow w-full pb-24 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.12, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
        <MobileNav />
        <GameModal />
      </div>
    </SessionProvider>
  );
}

function TelegramAuthProvider() {
  useTelegramAuth();
  return null;
}

function RatesLoader() {
  const { isLoadingRates } = useRegionStore();
  if (!isLoadingRates) return null;

  return (
    <div className="fixed bottom-24 left-6 z-[500] flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0b] border border-[#f5a623]/40 rounded-2xl shadow-2xl backdrop-blur-xl md:bottom-6">
      <div className="w-3 h-3 border border-[#f5a623] border-t-transparent rounded-full animate-spin" />
      <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">
        Обновляем курсы...
      </span>
    </div>
  );
}
