import type { Metadata } from "next";
import { 
  Inter, 
  Bangers, 
  Arapey, 
  IM_Fell_DW_Pica_SC 
} from "next/font/google"; // Импортируем нужные шрифты
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

// Настраиваем шрифты
const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

const bangers = Bangers({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-bangers" 
});

const arapey = Arapey({ 
  weight: "400", 
  subsets: ["latin"], 
  style: ["normal", "italic"],
  variable: "--font-arapey" 
});

const imFell = IM_Fell_DW_Pica_SC({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-im-fell" 
});

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
      {/* Добавляем переменные шрифтов в className body */}
      <body className={`${inter.className} ${bangers.variable} ${arapey.variable} ${imFell.variable} antialiased bg-[#121212] text-white`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}