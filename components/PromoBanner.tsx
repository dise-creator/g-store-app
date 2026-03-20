export default function PromoBanner() {
  const banners = [
    { id: 1, img: "https://i.imgur.com/3Z4n5X1.jpg", title: "Мегамарт" },
    { id: 2, img: "https://i.imgur.com/8Q6z2X3.jpg", title: "PSN Turkey" },
    { id: 3, img: "https://i.imgur.com/5V9k1A2.jpg", title: "Бесплатные игры" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      {banners.map((b) => (
        <div key={b.id} className="relative aspect-[16/9] overflow-hidden rounded-[32px] cursor-pointer hover:opacity-90 transition shadow-xl">
          <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" />
        </div>
      ))}
    </div>
  );
}