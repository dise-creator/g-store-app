import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Game Store",
  description: "Digital Keys Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      {/* Добавили bg-[#121212] для серого фона всей страницы */}
      <body className="antialiased font-sans bg-[#121212] text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}