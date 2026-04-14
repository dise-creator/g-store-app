import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import YandexProvider from "next-auth/providers/yandex";
import { createClient } from "@supabase/supabase-js";

// Создаём отдельный клиент Supabase с правами администратора
// чтобы писать в БД даже если у пользователя нет прав
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Этот callback срабатывает каждый раз когда пользователь входит
    async signIn({ user, account }) {
      if (!user.email) return true; // если нет email — пропускаем

      // Проверяем есть ли уже такой пользователь в БД
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();

      // Если пользователя нет — создаём нового
      if (!existingUser) {
        await supabaseAdmin.from("users").insert({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account?.provider,      // "google" или "yandex"
          provider_id: account?.providerAccountId, // id пользователя у провайдера
        });
      }

      return true; // разрешаем вход
    },

    // Этот callback добавляет id пользователя в сессию
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};