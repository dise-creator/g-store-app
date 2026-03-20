interface GameCardProps {
  id: number;
  title: string;
  price: number; // Убедись, что здесь number
  discount: string;
  image: string;
}

export default function GameCard({ id, title, price, discount, image }: GameCardProps) {
  return (
    <div className="bg-[#1E2530] rounded-3xl overflow-hidden border border-white/5 hover:border-[#a855f7]/50 transition-all group">
      <div className="relative aspect-[3/4]">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-[#E81EFE] text-white text-xs font-bold px-2 py-1 rounded-lg">
          {discount}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-4 uppercase truncate">{title}</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Цена</p>
            <p className="text-xl font-black text-white">{price.toLocaleString()} ₽</p>
          </div>
          <button className="bg-[#a855f7] p-3 rounded-2xl hover:bg-[#9333ea] transition-colors">
            <span className="text-white font-bold">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}