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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Стили для 3D эффекта
  const dark3D = {
    color: "#2D3748",
    textShadow: "0 1px 0 #1a202c, 0 2px 0 #1a202c, 0 3px 0 #1a202c, 0 5px 10px rgba(0,0,0,0.7)"
  };

  const viper3D = {
    color: "#00FFFF",
    textShadow: "0 1px 0 #00e6e6, 0 2px 0 #00cccc, 0 0 20px rgba(0, 255, 255, 0.8), 0 5px 12px rgba(0,0,0,0.6)"
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
      <AnimatedBackground />

      <Link href="/" className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all z-50 group">
        <X size={24} className="text-white/40 group-hover:text-[#00ffff] transition-colors" />
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[440px] px-8 py-16 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[4rem] shadow-[0_0_100px_rgba(0,255,255,0.1)]"
      >
        {/* ОБЪЕМНЫЙ ЛОГОТИП С РАЗДЕЛЕНИЕМ */}
        <div className="text-center mb-16 relative">
          <h1 className="flex items-center justify-center font-black italic uppercase tracking-tighter select-none scale-110">
            <span style={dark3D} className="text-7xl">C</span>
            <span style={dark3D} className="text-7xl mr-3">L</span>
            
            <span style={viper3D} className="text-8xl">I</span>
            <span style={viper3D} className="text-8xl">C</span>
          </h1>
          {/* Линия под логотипом с бирюзовым свечением */}
          <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#00ffff]/50 to-transparent mx-auto mt-8 shadow-[0_0_15px_#00ffff]" />
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => signIn("yandex", { callbackUrl: "/" })}
            className="group relative w-full py-5 bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-[#ffcc00]/40 hover:shadow-[0_0_30px_rgba(255,204,0,0.1)] active:scale-[0.98]"
          >
            <span className="relative z-10 text-white font-black text-xs uppercase italic group-hover:text-[#ffcc00] transition-colors">Войти через Яндекс</span>
          </button>

          <button
            onClick={() => signIn("vk", { callbackUrl: "/" })}
            className="group relative w-full py-5 bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-[#0077ff]/30 hover:shadow-[0_0_30px_rgba(0,119,255,0.1)] active:scale-[0.98]"
          >
            <span className="relative z-10 text-white font-black text-xs uppercase italic group-hover:text-[#0077ff] transition-colors">Войти через VK ID</span>
          </button>
        </div>

        <p className="mt-14 text-center text-[8px] text-white/10 uppercase font-bold tracking-[0.2em]">
          Нажмите <span className="text-white/30 border border-white/10 px-2 py-0.5 rounded mx-1">ESC</span> для отмены
        </p>
      </motion.div>
    </main>
  );
}