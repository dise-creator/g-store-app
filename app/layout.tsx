import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";

export const metadata: Metadata = {
  title: "My Game Store",
  description: "Магазин лучших игр",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased bg-[#0f1218] text-white flex flex-col min-h-screen">
        {/* Модальное окно поиска (поверх всего) */}
        <SearchModal />
        
        {/* Шапка сайта */}
        <Header />
        
        {/* Панель корзины */}
        <CartDrawer /> 
        
        {/* Основной контент с отступом под Header */}
        <main className="flex-grow pt-[100px]">
          {children}
        </main>

        {/* Подвал сайта */}
        <Footer />
      </body>
    </html>
  );
}