import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

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
      <body className="antialiased bg-[#13151A] text-white flex flex-col min-h-screen">
        <Header />
        {/* Панель корзины должна быть на уровне лейаута */}
        <CartDrawer /> 
        
        <main className="flex-grow pt-[100px]">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}