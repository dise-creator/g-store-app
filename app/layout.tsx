import { Unbounded } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const unbounded = Unbounded({ 
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700", "900"],
  variable: "--font-unbounded",
});

export const metadata = {
  title: "Магазин игр",
  description: "Лучший выбор игр",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={unbounded.variable}>
      {/* Теперь body не ограничен клиентскими скриптами на старте */}
      <body className="bg-[#0a0a0b] antialiased text-white font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}