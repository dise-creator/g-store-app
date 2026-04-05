import { ALL_GAMES } from "@/store/games"; // Исправленный импорт
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ShoppingCart } from "lucide-react";

interface GamePageProps {
  params: { id: string };
}

export default function GamePage({ params }: GamePageProps) {
  // Находим игру в массиве ALL_GAMES
  const game = ALL_GAMES.find((g) => String(g.id) === String(params.id));

  if (!game) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050507] pt-32 pb-20 px-6 relative z-10">
      <div className="max-w-[1200px] mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#63f3f7] mb-12 transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-michroma text-[10px] uppercase tracking-widest">Назад в магазин</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Левая колонка: Изображение */}
          <div className="relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <Image 
              src={game.image} 
              alt={game.title} 
              fill 
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          {/* Правая колонка: Описание и покупка */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-michroma font-black text-white uppercase italic leading-tight">
                {game.title}
              </h1>
              <div className="h-1 w-24 bg-[#63f3f7]" />
            </div>

            <p className="text-white/60 text-lg font-light leading-relaxed">
              {game.description}
            </p>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-michroma text-white">
                {game.price.toLocaleString()}
              </span>
              <span className="text-2xl font-michroma text-[#63f3f7]">₽</span>
            </div>

            <button className="group relative w-full h-20 bg-[#63f3f7] text-black rounded-2xl font-black uppercase italic tracking-widest overflow-hidden transition-all hover:scale-[1.02] active:scale-95">
              <div className="relative z-10 flex items-center justify-center gap-3">
                <ShoppingCart size={24} />
                <span>Купить сейчас</span>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-xs uppercase tracking-widest font-michroma">
              Мгновенная доставка на email • Лицензионный ключ
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}