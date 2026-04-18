"use client";

import React from "react";
import Link from "next/link";

const PlayIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5v14l11-7z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative z-20 w-full px-4 md:px-8 pb-8 mt-10">
      <div className="max-w-[1420px] mx-auto bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl">
        
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* Лого + описание */}
          <div className="flex flex-col gap-4 max-w-[280px]">
            {/* Логотип как в хедере */}
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

          {/* Регионы */}
          <div className="flex flex-col gap-4">
            <p className="text-white/20 text-[9px] uppercase font-black tracking-[0.3em]">Регионы</p>
            <div className="flex flex-col gap-3">
              {[
                { flag: "🇹🇷", name: "Турция", desc: "Скидка до 65%" },
                { flag: "🇮🇳", name: "Индия", desc: "Скидка до 45%" },
              ].map((r) => (
                <div key={r.name} className="flex items-center gap-3">
                  <span className="text-xl">{r.flag}</span>
                  <div>
                    <p className="text-white/60 text-xs font-black uppercase italic">{r.name}</p>
                    <p className="text-[#63f3f7] text-[9px] font-black">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Соцсети + контакт */}
          <div className="flex flex-col gap-4">
            <p className="text-white/20 text-[9px] uppercase font-black tracking-[0.3em]">Мы в сети</p>
            <div className="flex gap-3">
             {/* VK */}
<a href="#" className="w-14 h-14 bg-white/5 hover:bg-[#0077ff] border border-white/10 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:border-[#0077ff]/50 hover:shadow-[0_0_20px_rgba(0,119,255,0.3)]">
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.747 3.23C14.923 12.4 14 12 14 12V7.5a.5.5 0 0 0-.5-.5h-2.7c-.5 0-.8.5-.8.5s.296-.05.4.5c.145.748.2 2 .2 2S10 10.5 10 11.5c-1.079-2.2-1.7-3.544-1.908-4.005A.64.64 0 0 0 7.5 7h-3.2a.289.289 0 0 0-.3.32c.1 2 3.3 8.68 6.4 9.68h1.3c1.1 0 1.3-.6 1.3-.6v-.95s.8.8 1.6.8h1.4c.6 0 1.2-.6 1.2-1.4 0-.5-.3-1-.3-1s1.8-1.2 2.4-3.8c.14-.6.15-1.05.147-1.55A.355.355 0 0 0 21.547 7Z"/>
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