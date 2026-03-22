import NextAuth from "next-auth";
import YandexProvider from "next-auth/providers/yandex";
import VKProvider from "next-auth/providers/vk";

const handler = NextAuth({
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    }),
    VKProvider({
      clientId: process.env.VK_CLIENT_ID!,
      clientSecret: process.env.VK_CLIENT_SECRET!,
    }),
  ],
  // Это нужно, чтобы сессия сохранялась долго
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };