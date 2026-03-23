"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CartPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-8 py-40 text-center">
      <Link href="/" className="inline-flex items-center gap-2 text-[#a855f7] mb-10">
        <ArrowLeft size={20} />
        <span className="font-black uppercase italic">Вернуться к играм</span>
      </Link>
      <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-4">Корзина</h1>
      <p className="text-white/20 text-xl font-bold uppercase tracking-widest">Здесь скоро появятся ваши покупки</p>
    </div>
  );
}