import Image from "next/image";

const BANNERS = [
  { id: 1, img: "https://i.imgur.com/3Z4n5X1.jpg", title: "Мегамарт" },
  { id: 2, img: "https://i.imgur.com/8Q6z2X3.jpg", title: "PSN Turkey" },
  { id: 3, img: "https://i.imgur.com/5V9k1A2.jpg", title: "Бесплатные игры" },
];

export default function PromoBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      {BANNERS.map((b) => (
        <div
          key={b.id}
          className="relative aspect-[16/9] overflow-hidden rounded-[32px] cursor-pointer hover:opacity-90 transition shadow-xl group"
        >
          <Image
            src={b.img}
            alt={b.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <h3 className="text-white text-xl font-bold uppercase tracking-tight">
              {b.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}