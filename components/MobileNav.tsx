"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Gamepad2, Heart, User, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import { useWishlistStore } from "@/store/useWishlist";

const NAV_ITEMS = [
  { id: "home", icon: Home, label: "Главная", href: "/" },
  { id: "catalog", icon: Gamepad2, label: "Каталог", href: "/catalog" },
  { id: "wishlist", icon: Heart, label: "Избранное", href: "/wishlist" },
  { id: "profile", icon: User, label: "Профиль", href: "/profile" },
];

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const lastScrollY = useRef(0);
  const showTimer = useRef<NodeJS.Timeout | null>(null);
  const prevTotal = useRef(0);

  const items = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  useEffect(() => {
    if (totalItems > prevTotal.current) {
      setCartPulse(true);
      setTimeout(() => setCartPulse(false), 800);
    }
    prevTotal.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 60) {
        if (showTimer.current) clearTimeout(showTimer.current);
        setVisible(false);
        window.dispatchEvent(new CustomEvent("headerShow"));
      } else if (currentY > lastScrollY.current + 10) {
        window.dispatchEvent(new CustomEvent("headerHide"));
        if (showTimer.current) clearTimeout(showTimer.current);
        showTimer.current = setTimeout(() => setVisible(true), 50);
      } else if (currentY < lastScrollY.current - 10) {
        if (showTimer.current) clearTimeout(showTimer.current);
        setVisible(false);
        window.dispatchEvent(new CustomEvent("headerShow"));
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (showTimer.current) clearTimeout(showTimer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[500] md:hidden"
        >
          <div
            className="flex items-center gap-1 px-3 py-3 rounded-[2rem]"
            style={{
              background: "rgba(10, 10, 20, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.id === "home" ? pathname === "/" : pathname === item.href;
              const isWishlist = item.id === "wishlist";

              return (
                <motion.button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  whileTap={{ scale: 0.85 }}
                  className="relative flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all no-hover"
                  style={{ minWidth: 56 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: "rgba(0, 214, 143, 0.1)",
                        border: "1px solid rgba(0, 214, 143, 0.25)",
                      }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                    />
                  )}

                  <div className="relative">
                    <Icon
                      size={20}
                      className="transition-all"
                      style={{
                        color: isActive ? "#00d68f" : "rgba(255,255,255,0.35)",
                      }}
                    />
                    {isWishlist && wishlistItems.length > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00d68f] rounded-full flex items-center justify-center">
                        <span className="text-black text-[8px] font-black">
                          {wishlistItems.length}
                        </span>
                      </div>
                    )}
                  </div>

                  <span
                    className="text-[9px] font-black uppercase tracking-wider mt-0.5 transition-all"
                    style={{
                      color: isActive ? "#00d68f" : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}

            {/* Корзина */}
            <motion.button
              onClick={() => window.dispatchEvent(new CustomEvent("openCart"))}
              whileTap={{ scale: 0.85 }}
              animate={cartPulse ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              className="relative flex flex-col items-center justify-center px-4 py-2 rounded-2xl ml-1 no-hover"
              style={{ minWidth: 56 }}
            >
              {cartPulse && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 rounded-2xl bg-[#00d68f]"
                />
              )}

              <div className="relative">
                <ShoppingCart
                  size={20}
                  style={{
                    color:
                      totalItems > 0 ? "#00d68f" : "rgba(255,255,255,0.35)",
                  }}
                />
                {totalItems > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00d68f] rounded-full flex items-center justify-center"
                  >
                    <span className="text-black text-[8px] font-black">
                      {totalItems}
                    </span>
                  </motion.div>
                )}
              </div>

              {totalItems > 0 ? (
                <span className="text-[9px] font-black text-[#00d68f] mt-0.5">
                  {totalPrice.toLocaleString()} ₽
                </span>
              ) : (
                <span className="text-[9px] font-black uppercase tracking-wider mt-0.5 text-white/25">
                  Корзина
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
