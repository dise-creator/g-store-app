import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import YandexProvider from "next-auth/providers/yandex";
import VkProvider from "next-auth/providers/vk";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const formatUser = (user: { id: string; name: string; email: string; image?: string }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  image: user.image ?? null,
});

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
    VkProvider({
      clientId: process.env.VK_CLIENT_ID!,
      clientSecret: process.env.VK_CLIENT_SECRET!,
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
        const { data: user } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();
        if (!user) return null;
        return formatUser(user);
      },
    }),

    CredentialsProvider({
      id: "email-password",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isRegister: { label: "Register", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: user } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (credentials.isRegister === "true") {
          if (user) throw new Error("Пользователь уже существует");
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const { data: newUser } = await supabaseAdmin
            .from("users")
            .insert({
              name: credentials.name || credentials.email.split("@")[0],
              email: credentials.email,
              password: hashedPassword,
              provider: "email",
            })
            .select()
            .single();
          if (!newUser) return null;
          return formatUser(newUser);
        }

        if (!user?.password) throw new Error("Пользователь не найден");
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Неверный пароль");
        return formatUser(user);
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials" || account?.provider === "email-password") return true;
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

    async jwt({ token, user, account }) {
      // При первом входе сохраняем email в токен
      if (user) {
        token.email = user.email;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
        // Всегда берём email из токена
        if (token.email) {
          session.user.email = token.email as string;
        }
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/signin",
  },
};