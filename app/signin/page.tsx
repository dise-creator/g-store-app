"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function SignInPage() {
  const router = useRouter();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showEmailModal) router.push("/");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, showEmailModal]);

  useEffect(() => {
    (window as any).onTelegramAuth = async (user: any) => {
      const res = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        setTelegramUser(user);
        setShowEmailModal(true);
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "clicps_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", "https://clicps.ru/api/auth/telegram-redirect");
    script.setAttribute("data-request-access", "write");
    script.async = true;
    document.getElementById("telegram-widget")?.appendChild(script);

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, []);

  const handleEmailSubmit = async () => {
    if (!email.includes("@")) {
      setEmailError("Введи корректный email");
      return;
    }
    setEmailLoading(true);
    setEmailError("");
    try {
      const res = await fetch("/api/auth/telegram-signin-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          tgId: String(telegramUser.id),
          tgName: telegramUser.first_name,
          tgPhoto: telegramUser.photo_url,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setEmailError(data.error || "Ошибка");
        return;
      }
      const result = await signIn("credentials", {
        email,
        telegramId: data.telegramId,
        callbackUrl: "/",
        redirect: false,
      });
      if (result?.ok) {
        window.location.href = "/";
      } else {
        setEmailError("Ошибка входа: " + result?.error);
      }
    } catch (e) {
      setEmailError("Ошибка входа, попробуй снова");
    } finally {
      setEmailLoading(false);
    }
  };

  const dark3D = {
    color: "#2D3748",
    textShadow: "0 1px 0 #1a202c, 0 2px 0 #1a202c, 0 3px 0 #1a202c, 0 5px 10px rgba(0,0,0,0.7)"
  };

  const viper3D = {
    color: "#00FFFF",
    textShadow: "0 1px 0 #00e6e6, 0 2px 0 #00cccc, 0 0 20px rgba(0, 255, 255, 0.8), 0 5px 12px rgba(0,0,0,0.6)"
  };

  const providers = [
    { id: "yandex", label: "Войти через Яндекс", color: "#ffcc00" },
    { id: "google", label: "Войти через Google", color: "#ea4335" },
    { id: "vk", label: "Войти через VK ID", color: "#0077ff" },
  ];

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
      <AnimatedBackground />

      <Link href="/" className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all z-50 group">
        <X size={24} className="text-white/40 group-hover:text-[#00ffff] transition-colors" />
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[440px] mx-4 px-8 py-12 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[4rem] shadow-[0_0_100px_rgba(0,255,255,0.1)]"
      >
        {/* Логотип */}
        <div className="text-center mb-10 relative">
          <h1 className="flex items-center justify-center font-black italic uppercase tracking-tighter select-none scale-110">
            <span style={dark3D} className="text-7xl">C</span>
            <span style={dark3D} className="text-7xl mr-3">L</span>
            <span style={viper3D} className="text-8xl">I</span>
            <span style={viper3D} className="text-8xl">C</span>
          </h1>
          <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#00ffff]/50 to-transparent mx-auto mt-6 shadow-[0_0_15px_#00ffff]" />
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-black mt-4">
            Выбери способ входа
          </p>
        </div>

        {/* Кнопки провайдеров */}
        <div className="flex flex-col gap-3">
          {providers.map((provider) => (
            <motion.button
              key={provider.id}
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              className="group relative w-full py-4 bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden transition-all"
              style={{
                ["--hover-color" as any]: provider.color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = provider.color + "60";
                e.currentTarget.style.boxShadow = `0 0 20px ${provider.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span
                className="relative z-10 text-white/60 group-hover:text-white font-black text-xs uppercase italic tracking-widest transition-colors"
              >
                {provider.label}
              </span>
            </motion.button>
          ))}

          {/* Разделитель */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-white/20 text-[9px] uppercase font-black tracking-widest">или</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Telegram виджет */}
          <div className="w-full flex items-center justify-center py-1">
            <div id="telegram-widget" />
          </div>
        </div>

        <p className="mt-8 text-center text-[8px] text-white/10 uppercase font-bold tracking-[0.2em]">
          Нажмите <span className="text-white/30 border border-white/10 px-2 py-0.5 rounded mx-1">ESC</span> для отмены
        </p>
      </motion.div>

      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md px-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-[400px] bg-[#0a0a0c] border border-white/10 rounded-[2rem] p-8 flex flex-col gap-5"
            >
              <div>
                <p className="text-white font-black uppercase italic text-xl">Почти готово!</p>
                <p className="text-white/30 text-xs mt-1">
                  Привет, {telegramUser?.first_name}! Введи email для аккаунта
                </p>
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
                placeholder="your@email.com"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 focus:border-[#63f3f7]/40 rounded-2xl text-white font-bold text-sm outline-none transition-all placeholder-white/20"
              />
              {emailError && (
                <p className="text-red-400 text-xs font-black">{emailError}</p>
              )}
              <button
                onClick={handleEmailSubmit}
                disabled={emailLoading}
                className="w-full py-4 bg-[#63f3f7] text-black font-black uppercase italic text-sm rounded-2xl disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(99,243,247,0.3)]"
              >
                {emailLoading ? "Входим..." : "Войти"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}