"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export function useTelegramAuth() {
  const { data: session } = useSession();

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