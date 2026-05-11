"use client";

import React from "react";
import Image from "next/image";
import { useCartStore } from "@/store/useCart";
import { Zap } from "lucide-react";
import type { Game } from "@/store/games";

interface SubscriptionCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  color: string;
  duration: string;
}

export default function SubscriptionCard({
  id,
  title,
  price,
  image,
  color,
  duration,
}: SubscriptionCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      id,
      title,
      price,
      image,
      category: "subscription",
      shortDescription: "",
      fullDescription: "",
      screenshots: [],
      editions: [],
    } as Game);
  };

  return (
    <button
      onClick={handleAdd}
      className="group relative overflow-hidden rounded-[2.5rem] bg-white/5 border border-[#00d68f]/15 p-8 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-left w-full"
    >
      <div
        className="absolute -right-20 -top-20 w-64 h-64 blur-[100px] opacity-20 transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="w-20 h-20 relative rounded-2xl overflow-hidden shadow-2xl bg-black/20">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-[#00d68f]/20">
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              {duration}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-white uppercase leading-none">
            {title}
          </h3>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-3 font-bold">
            Мгновенная доставка на почту
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-3xl font-black text-white">
            {price.toLocaleString()} ₽
          </span>
          <div className="bg-[#a855f7] text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-[#a855f7]/20">
            Купить
          </div>
        </div>
      </div>
    </button>
  );
}
