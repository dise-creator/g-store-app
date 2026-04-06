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
      {/* Убрали inter.className, добавили стандартный font-sans */}
      <body className="antialiased font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}