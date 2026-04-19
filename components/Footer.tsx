"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-20 w-full px-4 md:px-8 pb-8 mt-10">
      <div className="max-w-[1420px] mx-auto bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl">
        
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* Лого + описание */}
          <div className="flex flex-col gap-4 max-w-[280px]">
            <div className="flex items-center skew-x-[-12deg]">
              <span className="font-michroma text-white text-2xl font-black" style={{ WebkitTextStroke: "1px white" }}>CL</span>
              <span className="font-unbounded text-white text-4xl font-black" style={{ WebkitTextStroke: "3px white", textShadow: "4px 4px 0px rgba(0,0,0,1)" }}>IC</span>
            </div>
            <p className="text-white/30 text-xs leading-relaxed font-medium">
              Магазин карт пополнения PlayStation Network. Моментальная доставка ключей на почту.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Работаем 24/7</span>
            </div>
          </div>

          {/* Навигация */}
          <div className="flex flex-col gap-4">
            <p className="text-white/20 text-[9px] uppercase font-black tracking-[0.3em]">Навигация</p>
            <nav className="flex flex-col gap-3">
              {[
                { label: "О магазине", href: "#" },
                { label: "Контакты", href: "#" },
                { label: "Отзывы", href: "#" },
                { label: "Поддержка", href: "#" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-white/40 hover:text-[#63f3f7] transition-colors text-xs font-black uppercase italic tracking-widest"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Регионы — убраны скидки */}
          <div className="flex flex-col gap-4">
            <p className="text-white/20 text-[9px] uppercase font-black tracking-[0.3em]">Регионы</p>
            <div className="flex flex-col gap-3">
              {[
                { flag: "🇹🇷", code: "TR", name: "Турция" },
                { flag: "🇮🇳", code: "IN", name: "Индия" },
              ].map((r) => (
                <div key={r.name} className="flex items-center gap-3">
                  <span className="text-white/40 text-[10px] font-black">{r.code}</span>
                  <span className="text-xl">{r.flag}</span>
                  <p className="text-white/60 text-xs font-black uppercase italic">{r.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Соцсети + контакт */}
          <div className="flex flex-col gap-4">
            <p className="text-white/20 text-[9px] uppercase font-black tracking-[0.3em]">Мы в сети</p>
            <div className="flex gap-3">

              {/* VK — увеличен и улучшен иконка */}
              <a href="#" className="w-14 h-14 bg-[#0077ff]/20 hover:bg-[#0077ff] border border-[#0077ff]/40 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:border-[#0077ff]/50 hover:shadow-[0_0_20px_rgba(0,119,255,0.3)]">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.338-3.202C5.07 11.374 4.36 9.17 4.36 8.69c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V10.17c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.745-.576.745z"/>
                </svg>
              </a>

              {/* Telegram */}
              <a href="#" className="w-14 h-14 bg-white/5 hover:bg-[#229ed9] border border-white/10 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:border-[#229ed9]/50 hover:shadow-[0_0_20px_rgba(34,158,217,0.3)]">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
            <div className="mt-2 p-3 bg-[#63f3f7]/5 border border-[#63f3f7]/10 rounded-2xl">
              <p className="text-white/30 text-[9px] uppercase font-black tracking-widest mb-1">Поддержка</p>
              <p className="text-[#63f3f7] text-xs font-black italic">@clic_support</p>
            </div>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-black">
            © 2026 CLIC STORE. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
          </p>
          <div className="flex gap-6">
            {[
              { label: "Пользовательское соглашение", href: "#" },
              { label: "Политика конфиденциальности", href: "#" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/20 hover:text-[#63f3f7] transition-colors text-[9px] uppercase tracking-[0.2em] font-black"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}