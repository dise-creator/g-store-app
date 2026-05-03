"use client";

import React, { useState, useEffect } from "react";
import Header from "./Header";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";
import GameModal from "./GameModal";
import Footer from "./Footer";
import { useGamesStore } from "@/store/games";
import { SessionProvider } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useRegionStore } from "@/store/useRegion";
import { motion, AnimatePresence } from "framer-motion";
import { useTelegramAuth } from "../hooks/useTelegramAuth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const allGames = useGamesStore((state) => state.allGames);
  const fetchRates = useRegionStore((state) => state.fetchRates);

  useEffect(() => {
    setMounted(true);
    fetchRates();
  }, [fetchRates]);

  return (
    <SessionProvider>
      <TelegramAuthProvider />
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

        {/* Индикатор загрузки курсов */}
        {mounted && <RatesLoader />}

        {/* MAIN с анимацией */}
        <main className="relative z-10 flex-grow w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* FOOTER */}
        <Footer />

        {/* GAME MODAL */}
        <div className="fixed inset-0 z-[999] pointer-events-none">
          <div className="pointer-events-auto">
            <GameModal />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}

// Отдельный компонент чтобы хук работал внутри SessionProvider
function TelegramAuthProvider() {
  useTelegramAuth();
  return null;
}

function RatesLoader() {
  const { isLoadingRates } = useRegionStore();

  if (!isLoadingRates) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[500] flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="w-3 h-3 border border-[#63f3f7] border-t-transparent rounded-full animate-spin" />
      <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">
        Обновляем курсы...
      </span>
    </div>
  );
}