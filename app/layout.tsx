import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({ 
  subsets: ["latin"], 
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"]
});
import { 
  Inter, 
  Bangers, 
  Arapey, 
  IM_Fell_DW_Pica_SC,
  Barlow_Condensed
} from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"], 
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"]
});

const barlowCondensed = Barlow_Condensed({ 
  subsets: ["latin"], 
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"]
});

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
      <body className={`
        ${inter.variable}
        ${barlowCondensed.variable}
        ${bangers.variable}
        ${arapey.variable}
        ${imFell.variable}
        font-[family-name:var(--font-rajdhani)]
        antialiased bg-[#0d1a0f] text-white
      `}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}