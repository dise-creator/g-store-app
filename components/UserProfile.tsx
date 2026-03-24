"use client";

import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Логика закрытия по ESC (только если меню открыто)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // ГЛАВНАЯ ПРАВКА: Убираем лишнее окно для гостей
  const handleProfileClick = () => {
    if (!session) {
      // Если не залогинен — сразу летим на красивую страницу
      router.push('/signin');
    } else {
      // Если залогинен — открываем меню управления профилем
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      {/* Кнопка профиля */}
      <button
        onClick={handleProfileClick}
        className={`p-3 rounded-2xl border transition-all active:scale-90 ${
          isOpen && session
            ? "bg-[#a855f7]/20 border-[#a855f7]/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]" 
            : "bg-white/5 border-white/5 hover:bg-white/10"
        }`}
      >
        {session?.user?.image ? (
          <img src={session.user.image} className="w-6 h-6 rounded-full" alt="avatar" />
        ) : (
          <User size={24} className={isOpen && session ? "text-[#a855f7]" : "text-white"} />
        )}
      </button>

      <AnimatePresence>
        {/* Показываем выпадающее меню ТОЛЬКО если пользователь вошел в систему */}
        {isOpen && session && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-72 bg-[#0a0a0b] border border-white/10 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110] backdrop-blur-3xl"
            >
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}