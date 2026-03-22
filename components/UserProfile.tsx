"use client";

import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { User, LogOut, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserProfile() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-90"
      >
        {session?.user?.image ? (
          <img src={session.user.image} className="w-6 h-6 rounded-full" alt="avatar" />
        ) : (
          <User size={24} className="text-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-72 bg-[#0a0a0b] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl z-[110] backdrop-blur-3xl"
          >
            {session ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-full bg-[#a855f7]/20 flex items-center justify-center font-black">
                    {session.user?.name?.[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-white font-bold text-sm italic truncate">{session.user?.name}</p>
                    <p className="text-white/20 text-[10px] uppercase font-black tracking-widest">Игрок</p>
                  </div>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-black text-[10px] uppercase italic transition-all"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest px-2 mb-1">Войти через</p>
                <button 
                  onClick={() => signIn('yandex')}
                  className="w-full py-4 bg-[#ff0000]/10 border border-[#ff0000]/20 rounded-2xl text-white font-black text-xs uppercase italic hover:bg-[#ff0000]/20 transition-all"
                >
                  Яндекс ID
                </button>
                <button 
                  onClick={() => signIn('vk')}
                  className="w-full py-4 bg-[#0077ff]/10 border border-[#0077ff]/20 rounded-2xl text-white font-black text-xs uppercase italic hover:bg-[#0077ff]/20 transition-all"
                >
                  VK ID
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}