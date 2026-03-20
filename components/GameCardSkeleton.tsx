"use client";

export default function GameCardSkeleton() {
  return (
    <div className="bg-[#1e2530] p-4 rounded-3xl border border-white/5 w-[300px] animate-pulse">
      {/* Имитация картинки */}
      <div className="w-full h-[380px] bg-white/5 rounded-2xl mb-4" />
      
      {/* Имитация текста */}
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
      <div className="h-3 bg-white/5 rounded w-1/2 mb-6" />
      
      {/* Имитация цены и кнопки */}
      <div className="flex justify-between items-center">
        <div className="h-6 bg-white/10 rounded w-20" />
        <div className="w-10 h-10 bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}