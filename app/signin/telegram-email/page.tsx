"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function TelegramEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.includes("@")) {
      setError("Введи корректный email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/telegram-signin-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "Ошибка");
        return;
      }

      await signIn("credentials", {
        email,
        telegramId: data.telegramId,
        callbackUrl: "/",
      });
    } catch {
      setError("Ошибка входа, попробуй снова");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[440px] px-8 py-16 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[4rem] shadow-[0_0_100px_rgba(0,255,255,0.1)]"
      >
        <div className="text-center mb-10">
          <p className="text-white font-black italic uppercase text-2xl">
            Почти готово!
          </p>
          <p className="text-white/30 text-sm mt-2">Введи email для аккаунта</p>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="your@email.com"
            className="w-full px-5 py-4 bg-white/5 border border-white/10 focus:border-[#63f3f7]/40 rounded-2xl text-white font-bold text-sm outline-none transition-all placeholder-white/20"
          />

          {error && <p className="text-red-400 text-xs font-black">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-5 bg-[#63f3f7] text-black font-black uppercase italic text-sm rounded-2xl disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(99,243,247,0.3)]"
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
