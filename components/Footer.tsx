"use client";

import { Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#13151A] border-t border-white/5 py-12 mt-20">
      <div className="max-w-[1420px] mx-auto px-6" border-radius="0 0 20px 20px">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Левая часть: Лого и Копирайт */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#a855f7] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">G</span>
              </div>
              <span className="text-lg font-black uppercase italic text-white">Store</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 G-STORE. Все права защищены.
            </p>
          </div>

          {/* Центральная часть: Навигация */}
          <nav className="flex gap-8 text-sm font-bold uppercase tracking-wider text-gray-400">
            <a href="#" className="hover:text-[#a855f7] transition-colors">О проекте</a>
            <a href="#" className="hover:text-[#a855f7] transition-colors">Контакты</a>
            <a href="#" className="hover:text-[#a855f7] transition-colors">Отзывы</a>
            <a href="#" className="hover:text-[#a855f7] transition-colors">Поддержка</a>
          </nav>

          {/* Правая часть: Соцсети */}
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center transition-all border border-blue-500/20">
              <span className="font-bold text-xs">VK</span>
            </a>
            <a href="#" className="w-10 h-10 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center transition-all border border-sky-400/20">
              <Send className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}