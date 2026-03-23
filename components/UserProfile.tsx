"use client";

import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { User, LogOut, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserProfile() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // 1. ЛОГИКА ЗАКРЫТИЯ ПО ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Кнопка открытия профиля */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-2xl border transition-all active:scale-90 ${
          isOpen 
            ? "bg-[#a855f7]/20 border-[#a855f7]/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]" 
            : "bg-white/5 border-white/5 hover:bg-white/10"
        }`}
      >
        {session?.user?.image ? (
          <img src={session.user.image} className="w-6 h-6 rounded-full" alt="avatar" />
        ) : (
          <User size={24} className={isOpen ? "text-[#a855f7]" : "text-white"} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Невидимая подложка для закрытия по клику вне окна */}
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-72 bg-[#0a0a0b] border border-white/10 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(168,85,247,0.25)] z-[110] backdrop-blur-3xl"
            >
              {session ? (
                /* ОКНО АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ */
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-full bg-[#a855f7]/20 flex items-center justify-center font-black text-[#a855f7] border border-[#a855f7]/30">
                      {session.user?.name?.[0]}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white font-bold text-sm italic truncate">{session.user?.name}</p>
                      <p className="text-[#a855f7] text-[10px] uppercase font-black tracking-widest">Игрок</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="w-full py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500 rounded-2xl font-black text-[10px] uppercase italic transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} /> Выйти
                  </button>
                </div>
              ) : (
                /* ОКНО ВХОДА (ТО, ЧТО МЫ ПРАВИЛИ) */
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-widest px-2 mb-1">Войти через</p>
                  
                  {/* Яндекс ID */}
                  <button 
                    onClick={() => signIn('yandex')}
                    className="group relative w-full py-4 bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-[#ff0000]/30 hover:shadow-[0_0_20px_rgba(255,0,0,0.15)]"
                  >
                    <span className="relative z-10 text-white font-black text-xs uppercase italic group-hover:text-[#ff0000] transition-colors">
                      Яндекс ID
                    </span>
                    <div className="absolute inset-0 bg-[#ff0000]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  {/* VK ID */}
                  <button 
                    onClick={() => signIn('vk')}
                    className="group relative w-full py-4 bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-[#0077ff]/30 hover:shadow-[0_0_20px_rgba(0,119,255,0.15)]"
                  >
                    <span className="relative z-10 text-white font-black text-xs uppercase italic group-hover:text-[#0077ff] transition-colors">
                      VK ID
                    </span>
                    <div className="absolute inset-0 bg-[#0077ff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}