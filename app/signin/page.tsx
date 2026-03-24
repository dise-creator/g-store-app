"use client";

import React, { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function SignInPage() {
  const router = useRouter();

  // Закрытие по ESC — возвращаем на главную
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Твой фирменный анимированный фон с шумом */}
      <AnimatedBackground />

      {/* Кнопка закрытия в углу (крестик) */}
      <Link 
        href="/" 
        className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all z-50 group"
      >
        <X size={24} className="text-white/40 group-hover:text-white transition-colors" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] px-8 py-12 bg-[#0a0a0b]/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
      >
        {/* Логотип по центру */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-2">
            GAME<span className="text-[#a855f7] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">STORE</span>
          </h1>
          <p className="text-white/30 text-[10px] uppercase font-bold tracking-[0.3em]">
            Digital Universe
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Яндекс ID — Желтый неон */}
          <button
            onClick={() => signIn("yandex", { callbackUrl: "/" })}
            className="group relative w-full py-5 bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-[#ffcc00]/40 hover:shadow-[0_0_30px_rgba(255,204,0,0.15)] active:scale-[0.98]"
          >
            <span className="relative z-10 text-white font-black text-xs uppercase italic group-hover:text-[#ffcc00] transition-colors">
              Войти через Яндекс
            </span>
            <div className="absolute inset-0 bg-[#ffcc00]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* VK ID — Синий неон */}
          <button
            onClick={() => signIn("vk", { callbackUrl: "/" })}
            className="group relative w-full py-5 bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-[#0077ff]/30 hover:shadow-[0_0_30px_rgba(0,119,255,0.12)] active:scale-[0.98]"
          >
            <span className="relative z-10 text-white font-black text-xs uppercase italic group-hover:text-[#0077ff] transition-colors">
              Войти через VK ID
            </span>
            <div className="absolute inset-0 bg-[#0077ff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[9px] text-white/20 uppercase font-black tracking-widest leading-relaxed">
            Нажимая «Войти», вы соглашаетесь <br /> с правилами платформы
          </p>
          {/* Подсказка про ESC */}
          <p className="mt-4 text-[8px] text-white/10 uppercase font-bold tracking-widest">
            Нажмите <span className="text-white/30 tracking-normal border border-white/10 px-1.5 py-0.5 rounded-md">ESC</span> чтобы выйти
          </p>
        </div>
      </motion.div>
    </main>
  );
}