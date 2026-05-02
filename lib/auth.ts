import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import YandexProvider from "next-auth/providers/yandex";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
    CredentialsProvider({
      id: "credentials",
      name: "Telegram",
      credentials: {
        email: { label: "Email", type: "text" },
        telegramId: { label: "Telegram ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.telegramId) return null;

        // Ищем только по email — не важно через что зарегался
        const { data: user } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return true;

      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();

      if (!existingUser) {
        await supabaseAdmin.from("users").insert({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account?.provider,
          provider_id: account?.providerAccountId,
        });
      }

      return true;
    },

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
