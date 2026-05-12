"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Heart } from "lucide-react";
import UserProfile from "./UserProfile";
import CartButton from "./CartButton";
import RegionSwitcher from "./RegionSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCart";
import { useWishlistStore } from "@/store/useWishlist";
import Link from "next/link";

const PlayIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

interface HeaderProps {
  onSearchClick: () => void;
  onCartClick: () => void;
  onWishlistClick?: () => void;
}

export default function Header({
  onSearchClick,
  onCartClick,
  onWishlistClick,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchActivated, setSearchActivated] = useState(false);
  const [wishlistPulse, setWishlistPulse] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const prevWishlist = useRef(0);

  const items = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      window.requestAnimationFrame(() => setScrolled(window.scrollY > 20));
    };
    const handleHide = () => {
      if (window.innerWidth < 768) setHeaderVisible(false);
    };
    const handleShow = () => {
      if (window.innerWidth < 768) setHeaderVisible(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("headerHide", handleHide);
    window.addEventListener("headerShow", handleShow);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("headerHide", handleHide);
      window.removeEventListener("headerShow", handleShow);
    };
  }, []);

  useEffect(() => {
    if (wishlistCount > prevWishlist.current) {
      setWishlistPulse(true);
      setTimeout(() => setWishlistPulse(false), 700);
    }
    prevWishlist.current = wishlistCount;
  }, [wishlistCount]);

  const handleSearchClick = () => {
    setSearchActivated(true);
    setTimeout(() => {
      setSearchActivated(false);
      onSearchClick();
    }, 300);
  };

  return (
    <>
      <AnimatePresence>
        {searchActivated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.3, 1] }}
            className="fixed inset-0 z-[99] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 85% 5%, rgba(99,243,247,0.4) 0%, transparent 60%)",
            }}
          />
        )}
      </AnimatePresence>

      <motion.header
        animate={{
          y: headerVisible ? 0 : "-120%",
          opacity: headerVisible ? 1 : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`fixed top-2 md:top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1440px] z-[100] px-4 md:px-8 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-700 flex justify-between items-center transform-gpu ${
          scrolled
            ? "py-2 md:py-3 bg-black/[0.15] backdrop-blur-[40px] border border-white/[0.1] shadow-2xl"
            : "py-3 md:py-6 bg-transparent backdrop-blur-[10px] border border-white/[0.05]"
        }`}
      >
        {/* Логотип */}
        <Link href="/">
          <motion.div
            animate={
              searchActivated
                ? { opacity: 0, x: -30, filter: "blur(8px)" }
                : { opacity: 1, x: 0, filter: "blur(0px)" }
            }
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative group/logo cursor-pointer shrink-0 h-10 md:h-14 flex items-center active:scale-95 transition-transform duration-150"
          >
            <div className="relative flex items-center h-full tracking-widest transition-all duration-500 skew-x-[-12deg] group-hover/logo:skew-x-[-8deg]">
              <div className="absolute -inset-3 rounded-2xl bg-[#ff6b00]/5 blur-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <h1 className="select-none flex items-center transition-all duration-500 h-full relative z-10">
                <div className="flex items-center mt-[-2px]">
                  <span
                    className="relative flex items-center justify-center font-michroma text-white text-xl md:text-4xl font-black transition-all duration-500 group-hover/logo:text-[#ff6b00]"
                    style={{ WebkitTextStroke: "1px white" }}
                  >
                    C
                    <PlayIcon className="absolute text-[#ff6b00] w-2.5 h-2.5 md:w-5 md:h-5 opacity-0 group-hover/logo:opacity-100 transition-all duration-300 transform scale-50 group-hover/logo:scale-100 translate-x-[1px] translate-y-[1px] drop-shadow-[0_0_10px_#ff6b00]" />
                  </span>
                  <span
                    className="font-michroma text-white text-xl md:text-4xl font-black ml-[1px] transition-all duration-500 group-hover/logo:text-[#ff6b00]"
                    style={{ WebkitTextStroke: "1px white" }}
                  >
                    L
                  </span>
                </div>
                <span className="relative flex items-center ml-1 h-full overflow-hidden">
                  <span
                    className="font-unbounded text-white text-3xl md:text-6xl font-black transition-all duration-500"
                    style={{
                      WebkitTextStroke: "2px white",
                      textShadow: "4px 4px 0px rgba(0,0,0,1)",
                    }}
                  >
                    IC
                  </span>
                  <motion.div
                    animate={{ x: ["-150%", "200%"] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
                  />
                </span>
              </h1>

              <motion.div
                className="absolute -bottom-1 left-0 h-[3px] bg-[#ff6b00] rounded-full shadow-[0_0_15px_#ff6b00]"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </Link>

        {/* Центр — только десктоп */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <AnimatePresence mode="wait">
            {searchActivated ? (
              <motion.div
                key="search"
                initial={{ width: 48, opacity: 0, borderRadius: "16px" }}
                animate={{ width: 400, opacity: 1, borderRadius: "20px" }}
                exit={{ width: 48, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="flex items-center gap-3 px-5 py-3 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99,243,247,0.08) 0%, rgba(99,243,247,0.03) 100%)",
                  border: "1px solid rgba(99,243,247,0.3)",
                  boxShadow:
                    "0 0 40px rgba(99,243,247,0.2), inset 0 0 20px rgba(99,243,247,0.05)",
                }}
              >
                <motion.div
                  initial={{ rotate: 0, scale: 1 }}
                  animate={{ rotate: [0, 20, -10, 0], scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.4 }}
                >
                  <Search size={18} className="text-[#ff6b00] shrink-0" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-white/50 text-sm font-bold tracking-wide whitespace-nowrap"
                >
                  Найти игру...
                </motion.span>
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-0.5 h-4 bg-[#ff6b00] rounded-full ml-1"
                />
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0, scale: 0 }}
                    animate={{ x: 300, opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.08,
                      ease: "easeOut",
                    }}
                    className="absolute w-1 h-1 rounded-full bg-[#ff6b00]"
                    style={{ top: "50%", left: 20 }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="region"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {mounted && <RegionSwitcher />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Правая часть */}
        <motion.div
          animate={
            searchActivated
              ? { opacity: 0, x: 30, filter: "blur(8px)" }
              : { opacity: 1, x: 0, filter: "blur(0px)" }
          }
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative flex items-center gap-1.5 md:gap-4"
        >
          <div className="block md:hidden">{mounted && <RegionSwitcher />}</div>

          <motion.button
            onClick={handleSearchClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.85, rotate: 15 }}
            className="p-2 md:p-3 bg-[#0a1860]/60 hover:bg-white/[0.08] rounded-xl md:rounded-2xl border border-[#ff6b00]/30 transition-colors group relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 rounded-2xl bg-[#ff6b00]/10"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <Search
              size={18}
              className="text-white/40 group-hover:text-[#ff6b00] transition-colors relative z-10"
            />
          </motion.button>

          <motion.button
            onClick={onWishlistClick}
            whileTap={{ scale: 0.8 }}
            className="relative p-2 md:p-3 bg-[#0a1860]/60 hover:bg-white/[0.08] rounded-xl md:rounded-2xl border border-[#ff6b00]/30 transition-all group overflow-visible hidden md:flex"
          >
            <motion.div
              className="absolute inset-0 rounded-2xl bg-[#ff6b00]/10"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <AnimatePresence>
              {wishlistPulse && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 rounded-2xl bg-[#ff6b00]/30 blur-xl pointer-events-none"
                />
              )}
            </AnimatePresence>
            <motion.div
              animate={
                wishlistPulse
                  ? {
                      scale: [1, 1.6, 0.85, 1.3, 1],
                      rotate: [0, -15, 10, -5, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Heart
                size={18}
                className={`transition-all relative z-10 ${
                  mounted && wishlistCount > 0
                    ? "text-[#ff6b00] fill-[#ff6b00]/30 drop-shadow-[0_0_8px_rgba(99,243,247,0.8)]"
                    : "text-white/40 group-hover:text-[#ff6b00]"
                }`}
              />
            </motion.div>
            <AnimatePresence>
              {wishlistPulse && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                      animate={{
                        opacity: 0,
                        scale: 0,
                        x: Math.cos((i / 6) * Math.PI * 2) * 28,
                        y: Math.sin((i / 6) * Math.PI * 2) * 28,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-[#ff6b00] pointer-events-none -translate-x-1/2 -translate-y-1/2"
                      style={{ zIndex: 20 }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {mounted && wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff6b00] text-black text-[9px] font-black rounded-full flex items-center justify-center"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="h-6 w-[1px] bg-white/10 hidden md:block" />

          <div className="flex items-center gap-1.5 md:gap-3">
            <UserProfile />
            <CartButton
              onClick={onCartClick}
              totalAmount={mounted ? totalAmount : 0}
              totalItems={mounted ? totalItems : 0}
            />
          </div>
        </motion.div>
      </motion.header>
    </>
  );
}
