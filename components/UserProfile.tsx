"use client";

import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { User, LogOut, Sparkles, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const handleProfileClick = () => {
    if (!session) {
      router.push('/signin');
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      {/* Кнопка профиля */}
      <motion.button
        onClick={handleProfileClick}
        whileTap={{ scale: 0.88 }}
        className={`relative p-3 rounded-2xl border transition-all overflow-hidden ${
          isOpen && session
            ? "bg-[#a855f7]/20 border-[#a855f7]/50 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-[#a855f7]/20"
        }`}
      >
        {/* Свечение при открытии */}
        <AnimatePresence>
          {isOpen && session && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#a855f7]/20 blur-xl rounded-2xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {session?.user?.image ? (
          <motion.img
            src={session.user.image}
            className="w-6 h-6 rounded-full relative z-10"
            alt="avatar"
            animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
          />
        ) : (
          <User size={24} className={`relative z-10 transition-colors ${isOpen && session ? "text-[#a855f7]" : "text-white"}`} />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && session && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.92, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 16, scale: 0.92, filter: "blur(8px)" }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="absolute right-0 mt-4 w-80 z-[110]"
              style={{
                background: "linear-gradient(135deg, #0d0a1a 0%, #0a0a0f 100%)",
                border: "1px solid rgba(168,85,247,0.15)",
                borderRadius: "2rem",
                boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
              }}
            >
              {/* Декоративный градиент сверху */}
              <div className="absolute top-0 left-0 right-0 h-32 rounded-t-[2rem] overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#a855f7]/10 to-transparent" />
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a855f7]/10 to-transparent -skew-x-12"
                />
              </div>

              <div className="relative p-6 flex flex-col gap-4">

                {/* Профиль */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="flex items-center gap-4 pb-5 border-b border-white/5"
                >
                  {/* Аватар с рамкой */}
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-[#a855f7]/30 blur-md" />
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        className="relative w-14 h-14 rounded-full border-2 border-[#a855f7]/40 z-10"
                        alt="avatar"
                      />
                    ) : (
                      <div className="relative w-14 h-14 rounded-full bg-[#a855f7]/20 flex items-center justify-center font-black text-xl text-[#a855f7] border-2 border-[#a855f7]/40 z-10">
                        {session.user?.name?.[0]}
                      </div>
                    )}
                    {/* Онлайн индикатор */}
                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a0f] z-20" />
                  </div>

                  <div className="overflow-hidden flex-1">
                    <p className="text-white font-black text-base italic truncate">{session.user?.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Shield size={10} className="text-[#a855f7]" />
                      <p className="text-[#a855f7] text-[9px] uppercase font-black tracking-widest">Игрок</p>
                    </div>
                    <p className="text-white/20 text-[9px] truncate mt-0.5">{session.user?.email}</p>
                  </div>
                </motion.div>

                {/* Кнопки */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col gap-2.5"
                >
                  {/* Моё пространство */}
                  <motion.button
                    onClick={() => { router.push('/profile'); setIsOpen(false); }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 px-5 bg-white/[0.03] hover:bg-[#a855f7]/10 border border-white/5 hover:border-[#a855f7]/30 text-white/60 hover:text-[#a855f7] rounded-2xl font-black text-[10px] uppercase italic tracking-widest transition-all flex items-center gap-3 group"
                  >
                    <div className="w-7 h-7 rounded-xl bg-white/5 group-hover:bg-[#a855f7]/20 border border-white/5 group-hover:border-[#a855f7]/30 flex items-center justify-center transition-all">
                      <Sparkles size={13} className="group-hover:text-[#a855f7] transition-colors" />
                    </div>
                    Моё пространство
                    <motion.span
                      className="ml-auto text-white/10 group-hover:text-[#a855f7]/50"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.button>

                  {/* Выйти */}
                  <motion.button
                    onClick={() => signOut()}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 px-5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/25 text-red-500/60 hover:text-red-400 rounded-2xl font-black text-[10px] uppercase italic tracking-widest transition-all flex items-center gap-3 group"
                  >
                    <div className="w-7 h-7 rounded-xl bg-red-500/5 group-hover:bg-red-500/15 border border-red-500/10 group-hover:border-red-500/25 flex items-center justify-center transition-all">
                      <LogOut size={13} />
                    </div>
                    Выйти
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}