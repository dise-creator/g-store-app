"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";

function TelegramEmailContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tgId = searchParams.get("tg_id");
  const tgName = searchParams.get("tg_name");
  const tgPhoto = searchParams.get("tg_photo");

  useEffect(() => {
    if (!tgId) {
      window.location.href = "/signin";
    }
  }, [tgId]);

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
        body: JSON.stringify({
          email,
          tgId,
          tgName,
          tgPhoto,
        }),
      });

      const data = await res.json();
      console.log("Ответ сервера:", data);

      if (!data.ok) {
        setError(data.error || "Ошибка");
        return;
      }

      const result = await signIn("credentials", {
        email,
        telegramId: data.telegramId,
        callbackUrl: "/",
        redirect: false,
      });

      console.log("SignIn result:", result);

      if (result?.ok) {
        window.location.href = "/";
      } else {
        setError("Ошибка входа: " + result?.error);
      }
    } catch (e) {
      console.error("Ошибка:", e);
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
          <p className="text-white font-black  uppercase text-2xl">
            Почти готово!
          </p>
          <p className="text-white/30 text-sm mt-2">
            Привет, {tgName || "друг"}! Введи email для аккаунта
          </p>
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
            className="w-full py-5 bg-[#63f3f7] text-black font-black uppercase  text-sm rounded-2xl disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(99,243,247,0.3)]"
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}

export default function TelegramEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <TelegramEmailContent />
    </Suspense>
  );
}
