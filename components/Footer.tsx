"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    // mt-12 — уменьшенный в 2.5 раза отступ от контента
    <footer className="w-full px-4 md:px-8 pb-8 mt-12">
      {/* Контейнер-остров со стеклянным эффектом и рамкой */}
      <div className="max-w-[1420px] mx-auto bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* Логотип CLIC как на вашем хедере */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-3xl font-black uppercase italic text-white tracking-tighter">
              CL<span className="text-blue-400">IC</span>
            </span>
            <p className="text-white/20 text-[10px] font-medium tracking-wider uppercase">
              © 2026 CLIC STORE. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
            </p>
          </div>

          {/* Навигация */}
          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
            <Link href="#" className="hover:text-blue-400 transition-colors">О Релок</Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">Контакты</Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">Отзывы</Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">Поддержка</Link>
          </nav>

          {/* Соцсети с оригинальными SVG */}
          <div className="flex gap-4">
            
            {/* VK (Оригинальный логотип) */}
            <a href="#" className="w-12 h-12 bg-white/5 hover:bg-[#0077ff] border border-white/10 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg group">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.83 2.05h-1.66C5.06 2.05 1.95 5.16 1.95 11.27v1.46c0 6.11 3.11 9.22 9.22 9.22h1.66c6.11 0 9.22-3.11 9.22-9.22v-1.46c0-6.11-3.11-9.22-9.22-9.22ZM17.21 15.6c-.19 2.21-1.39 3.5-3.51 3.5h-.17a.6.6 0 0 1-.61-.41l-.47-1.42c-.28-.85-.75-1.12-1.34-1.12-.51 0-.96.25-1.29.62-.26.3-.49.88-.49 1.83 0 .34-.14.49-.49.49h-1.07c-1.85 0-3.32-1.02-4.13-2.61-.75-1.46-.86-3.11-.86-4.91 0-1.8.44-3.37 1.34-4.57.81-1.08 2.02-1.68 3.58-1.68h.83c.35 0 .49.15.49.49 0 1.63 1.25 2.5 2.61 2.5a.6.6 0 0 0 .61-.61v-1.6c0-.49-.1-.7-.41-.83-.41-.18-.86-.25-1.29-.25a.61.61 0 0 1-.61-.61.6.6 0 0 1 .61-.61h3.32c.35 0 .49.15.49.49v2.24c0 .49.1.7.41.83a2.38 2.38 0 0 0 1.21.25c1.67 0 2.87-1.25 3.12-3.13a.6.6 0 0 1 .61-.53.6.6 0 0 1 .6.61c-.34 2.51-1.92 4.1-4.22 4.5-.4.07-.61.35-.61.73a.6.6 0 0 0 .6.61h.17c2.12 0 3.32 1.29 3.51 3.51Z"/>
              </svg>
            </a>
            
            {/* Telegram (Оригинальный логотип) */}
            <a href="#" className="w-12 h-12 bg-white/5 hover:bg-[#229ed9] border border-white/10 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg group">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.53.26l.195-2.82 5.144-4.643c.224-.2-.045-.31-.343-.11l-6.357 4.004-2.73-.853c-.593-.185-.605-.593.124-.878l10.667-4.11c.494-.18.926.115.733.958z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Футер-ссылки */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap justify-center md:justify-start gap-8 opacity-40 text-[9px] uppercase tracking-[0.3em] text-white">
          <Link href="#" className="hover:text-blue-400 transition-colors">Пользовательское соглашение</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors">Политика конфиденциальности</Link>
        </div>
      </div>
    </footer>
  );
}