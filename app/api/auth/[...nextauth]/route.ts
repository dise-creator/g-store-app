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
  // Указываем NextAuth использовать твой дизайн страницы
  pages: {
    signIn: '/signin', // Путь к файлу app/signin/page.tsx
    error: '/signin',  // Если возникнет ошибка (как на том скрине), он вернет пользователя на твой красивый дизайн
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Добавляем callbacks, чтобы данные пользователя пробрасывались правильно
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };