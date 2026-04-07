export default function PromoBanner() {
  const banners = [
    { id: 1, img: "https://i.imgur.com/3Z4n5X1.jpg", title: "Мегамарт" },
    { id: 2, img: "https://i.imgur.com/8Q6z2X3.jpg", title: "PSN Turkey" },
    { id: 3, img: "https://i.imgur.com/5V9k1A2.jpg", title: "Бесплатные игры" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      {banners.map((b) => (
        <div 
          key={b.id} 
          className="relative aspect-[16/9] overflow-hidden rounded-[32px] cursor-pointer hover:opacity-90 transition shadow-xl group"
        >
          {/* ИЗМЕНЕНО: теперь картинка берется из b.img */}
          <img 
            src={b.img} 
            alt={b.title} 
            className="w-full h-full object-cover" 
          />
          
          {/* ДОБАВЛЕНО: наложение с заголовком, чтобы было понятно, что это за акция */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
             <h3 className="text-white text-xl font-bold uppercase italic tracking-tight">
               {b.title}
             </h3>
          </div>
        </div>
      ))}
    </div>
  );
}