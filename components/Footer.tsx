"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    // mt-10 — расстояние уменьшено в 3 раза для плотного прилегания к контенту
    <footer className="w-full px-4 md:px-8 pb-8 mt-10">
      {/* Контейнер-остров со стеклянным эффектом */}
      <div className="max-w-[1420px] mx-auto bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* Логотип CLIC */}
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

          {/* Соцсети */}
          <div className="flex gap-4">
            
            {/* VK (Актуальный SVG из вашего примера) */}
            <a 
              href="#" 
              className="w-12 h-12 bg-white/5 hover:bg-[#0077ff] border border-white/10 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg group"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-6 h-6 fill-current" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15.073 2H8.937C3.338 2 2 3.338 2 8.927v6.137C2 20.662 3.338 22 8.937 22h6.136C20.662 22 22 20.662 22 15.064V8.927C22 3.338 20.662 2 15.073 2Zm2.946 13.042c.162 2.215-1.214 3.511-3.342 3.511h-.166a.582.582 0 0 1-.588-.415l-.462-1.423c-.276-.845-.733-1.124-1.311-1.124-.505 0-.946.244-1.266.613-.254.296-.48.878-.48 1.83 0 .338-.141.49-.478.49h-1.077c-1.85 0-3.321-1.018-4.137-2.614-.76-1.464-.863-3.111-.863-4.912 0-1.802.443-3.364 1.345-4.56.81-1.085 2.023-1.68 3.585-1.68h.831c.355 0 .49.155.49.49V9.52c0 .493.1.693.411.83a2.385 2.385 0 0 0 1.213.253c1.67 0 2.871-1.246 3.125-3.13a.602.602 0 0 1 .6-.53.601.601 0 0 1 .602.61c-.34 2.508-1.92 4.094-4.223 4.5-.398.07-.604.354-.604.726a.598.598 0 0 0 .604.606h.163c2.126 0 3.332 1.285 3.52 3.504Z"/>
              </svg>
            </a>
            
            {/* Telegram (Оригинальный самолетик) */}
            <a 
              href="#" 
              className="w-12 h-12 bg-white/5 hover:bg-[#229ed9] border border-white/10 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg group"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 fill-current transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.53.26l.195-2.82 5.144-4.643c.224-.2-.045-.31-.343-.11l-6.357 4.004-2.73-.853c-.593-.185-.605-.593.124-.878l10.667-4.11c.494-.18.926.115.733.958z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Нижние ссылки */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap justify-center md:justify-start gap-8 opacity-40 text-[9px] uppercase tracking-[0.3em] text-white">
          <Link href="#" className="hover:text-blue-400 transition-colors">Пользовательское соглашение</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors">Политика конфиденциальности</Link>
        </div>
      </div>
    </footer>
  );
}