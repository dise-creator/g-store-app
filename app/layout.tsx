// layout.tsx
import type { Metadata } from "next";
import { Nunito, Bangers, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

export const metadata: Metadata = {
  title: "CLIC — Digital Keys Store",
  description: "Магазин цифровых карт пополнения PS5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body
        className={`
        ${nunito.variable}
        ${barlowCondensed.variable}
        ${bangers.variable}
        antialiased text-white bg-[#0d1f6e]
      `}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
