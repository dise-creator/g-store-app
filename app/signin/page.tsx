"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, Trophy, Gift, TrendingDown } from "lucide-react";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";

const YandexIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.04 12c0-5.523 4.476-10 9.998-10 5.523 0 10 4.477 10 10s-4.477 10-10 10c-5.522 0-9.998-4.477-9.998-10z" fill="#FC3F1D"/>
    <path d="M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.616 2.1 1.881 2.959l1.045.715-3.003 4.537H7.49l2.695-4.078c-1.55-1.111-2.42-2.1-2.42-3.971 0-2.288 1.595-3.806 4.146-3.806h2.915v11.85h-1.506V7.666z" fill="#fff"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const VKIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.338-3.202C5.07 11.374 4.36 9.17 4.36 8.69c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V10.17c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.745-.576.745z" fill="#0077FF"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="#29B6F6"/>
  </svg>
);

const BENEFITS = [
  { icon: BarChart3, text: "Аналитика и статистика покупок" },
  { icon: Trophy, text: "Достижения и прокачка аккаунта" },
  { icon: Gift, text: "Бонусная программа лояльности" },
  { icon: TrendingDown, text: "Скидка до 15% на все покупки" },
];

export default function SignInPage() {
  const router = useRouter();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showEmailModal) router.push("/");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, showEmailModal]);

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
    { id: "yandex", label: "Яндекс", icon: <YandexIcon />, color: "#FC3F1D", bg: "rgba(252,63,29,0.12)" },
    { id: "google", label: "Google", icon: <GoogleIcon />, color: "#34a853", bg: "rgba(52,168,83,0.12)" },
    { id: "vk", label: "VK ID", icon: <VKIcon />, color: "#0077ff", bg: "rgba(0,119,255,0.12)" },
    { id: "telegram", label: "Войти через бота", icon: <TelegramIcon />, color: "#29b6f6", bg: "rgba(41,182,246,0.12)" },
  ];

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] py-10">
      <AnimatedBackground />

      <Link href="/" className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all z-50 group">
        <X size={20} className="text-white/40 group-hover:text-[#00ffff] transition-colors" />
      </Link>

      <div className="relative z-10 w-full max-w-[900px] mx-4 flex flex-col md:flex-row gap-6">

        {/* Левая часть — преимущества */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col justify-center gap-6 px-4 md:px-8"
        >
          <div>
            <h1 className="flex items-center font-black italic uppercase tracking-tighter select-none">
              <span style={dark3D} className="text-6xl md:text-7xl">C</span>
              <span style={dark3D} className="text-6xl md:text-7xl mr-2">L</span>
              <span style={viper3D} className="text-7xl md:text-8xl">I</span>
              <span style={viper3D} className="text-7xl md:text-8xl">C</span>
            </h1>
            <p className="text-white/40 text-sm mt-3 leading-relaxed">
              Создай аккаунт и получи доступ ко всем возможностям магазина
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-2xl"
              >
                <div className="w-8 h-8 rounded-xl bg-[#63f3f7]/10 border border-[#63f3f7]/20 flex items-center justify-center shrink-0">
                  <benefit.icon size={14} className="text-[#63f3f7]" />
                </div>
                <span className="text-white/60 text-xs font-bold">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Правая часть — кнопки */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full md:w-[340px] px-8 py-10 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,255,255,0.08)]"
        >
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-black mb-6 text-center">
            Выбери способ входа
          </p>

          <div className="flex flex-col gap-3">
            {providers.map((provider) => {
              const isHovered = hoveredProvider === provider.id;
              return (
                <motion.button
                  key={provider.id}
                  onClick={() => {
                    if (provider.id === "telegram") {
                      window.open("https://t.me/clicps_bot", "_blank");
                    } else {
                      signIn(provider.id, { callbackUrl: "/" });
                    }
                  }}
                  whileTap={{ scale: 0.97 }}
                  onHoverStart={() => setHoveredProvider(provider.id)}
                  onHoverEnd={() => setHoveredProvider(null)}
                  className="relative w-full py-4 px-5 rounded-2xl overflow-hidden transition-all duration-300 flex items-center gap-3"
                  style={{
                    background: isHovered ? provider.bg : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isHovered ? provider.color + "50" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: isHovered ? `0 0 25px ${provider.color}15` : "none",
                  }}
                >
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: "-100%" }}
                        animate={{ opacity: 1, x: "200%" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 -skew-x-12 pointer-events-none"
                        style={{ background: `linear-gradient(90deg, transparent, ${provider.color}15, transparent)` }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="shrink-0 transition-transform duration-300" style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}>
                    {provider.icon}
                  </div>

                  <span
                    className="relative z-10 font-black text-xs uppercase italic tracking-widest transition-colors duration-300"
                    style={{ color: isHovered ? provider.color : "rgba(255,255,255,0.5)" }}
                  >
                    {provider.id === "telegram" ? provider.label : `Войти через ${provider.label}`}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Подсказка для Telegram */}
          <div className="mt-4 p-3 bg-[#29b6f6]/5 border border-[#29b6f6]/15 rounded-2xl">
            <p className="text-[#29b6f6]/60 text-[9px] text-center font-bold leading-relaxed">
              При входе через Telegram откроется наш бот — авторизация произойдёт автоматически
            </p>
          </div>

          <p className="mt-6 text-center text-[8px] text-white/10 uppercase font-bold tracking-[0.2em]">
            Нажмите <span className="text-white/20 border border-white/10 px-2 py-0.5 rounded mx-1">ESC</span> для отмены
          </p>
        </motion.div>
      </div>

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