"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export function useTelegramAuth() {
  const { data: session } = useSession();

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    // Раскрываем на весь экран
    tg.expand();

    // Применяем цвета Telegram
    const colorScheme = tg.colorScheme; // "light" или "dark"
    const themeParams = tg.themeParams;

    if (colorScheme === "light") {
      document.documentElement.style.setProperty("--tg-bg", themeParams.bg_color || "#ffffff");
      document.documentElement.style.setProperty("--tg-text", themeParams.text_color || "#000000");
      document.body.style.backgroundColor = themeParams.bg_color || "#ffffff";
      document.body.classList.add("tg-light");
    } else {
      document.body.classList.add("tg-dark");
    }

    tg.setHeaderColor(colorScheme === "light" ? "#ffffff" : "#0a0a0c");
    tg.setBackgroundColor(colorScheme === "light" ? "#ffffff" : "#0a0a0c");

  }, []);

  useEffect(() => {
    if (session) return;

    const tg = (window as any).Telegram?.WebApp;
    if (!tg || !tg.initData) return;

    async function autoAuth() {
      try {
        const res = await fetch("/api/auth/telegram-webapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: tg.initData }),
        });

        const data = await res.json();

        if (data.ok && data.email) {
          await signIn("credentials", {
            email: data.email,
            telegramId: data.telegramId,
            callbackUrl: "/",
            redirect: false,
          });
        }
      } catch (err) {
        console.error("Telegram auto auth error:", err);
      }
    }

    autoAuth();
  }, [session]);
}