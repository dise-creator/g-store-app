"use client";

import React from "react";

export default function GameCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {/* Имитация картинки (aspect-3/4 как в оригинале) */}
      <div className="relative aspect-[3/4] w-full bg-white/5 rounded-2xl" />
      
      {/* Имитация инфо-блока снизу */}
      <div className="flex flex-col gap-2 px-0.5">
        {/* Цена */}
        <div className="h-5 bg-white/10 rounded-md w-1/3" />
        {/* Название */}
        <div className="h-3 bg-white/5 rounded-md w-2/3" />
      </div>
    </div>
  );
}