"use client";

import React from "react";
import { MessageCircle, Star, Shield, Zap, Award } from "lucide-react";

export const AboutContent = () => (
  <div className="flex flex-col gap-6">
    <p className="text-white/60 text-base leading-relaxed">
      <span className="text-white font-black">CLIC STORE</span> — магазин карт пополнения PlayStation Network с моментальной доставкой. Мы работаем с 2024 года и помогаем геймерам покупать игры по выгодным ценам через зарубежные регионы.
    </p>
    <div className="grid grid-cols-2 gap-4">
      {[
        { icon: Zap, label: "Моментальная доставка", desc: "Ключи приходят на почту мгновенно после оплаты" },
        { icon: Shield, label: "Безопасно", desc: "Только официальные карты PSN от проверенных источников" },
        { icon: MessageCircle, label: "Работаем 24/7", desc: "Поддержка доступна в любое время суток" },
        { icon: Award, label: "1000+ клиентов", desc: "Довольных покупателей за всё время работы" },
      ].map((item) => (
        <div key={item.label} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col gap-3">
          <item.icon size={22} className="text-[#63f3f7]" />
          <p className="text-white font-black text-sm uppercase italic">{item.label}</p>
          <p className="text-white/30 text-xs leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
    <div className="p-5 bg-[#63f3f7]/5 border border-[#63f3f7]/10 rounded-2xl">
      <p className="text-white/50 text-sm leading-relaxed">
        Мы предлагаем карты пополнения PSN по ценам турецкого 🇹🇷 и индийского 🇮🇳 регионов — это позволяет экономить до <span className="text-[#63f3f7] font-black">65%</span> на покупке игр и подписок PS Plus.
      </p>
    </div>
  </div>
);

export const ContactsContent = () => (
  <div className="flex flex-col gap-5">
    <p className="text-white/50 text-base">Свяжитесь с нами любым удобным способом:</p>
    {[
      { label: "Telegram бот", value: "@clicps_bot", color: "#229ed9", href: "https://t.me/clicps_bot" },
      { label: "Поддержка Telegram", value: "@clic_support", color: "#229ed9", href: "https://t.me/clic_support" },
      { label: "VK сообщество", value: "vk.com/clicstore", color: "#0077ff", href: "https://vk.com" },
      { label: "Email", value: "support@clicstore.ru", color: "#63f3f7", href: "mailto:support@clicstore.ru" },
    ].map((item) => (
      <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between p-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl transition-all group"
      >
        <div>
          <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">{item.label}</p>
          <p className="font-black text-base italic" style={{ color: item.color }}>{item.value}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
          <MessageCircle size={18} className="text-white/30 group-hover:text-white/60" />
        </div>
      </a>
    ))}
    <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
      <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mb-1">Время ответа</p>
      <p className="text-white/50 text-sm">Обычно отвечаем в течение <span className="text-[#63f3f7] font-black">15 минут</span></p>
    </div>
  </div>
);

export const ReviewsContent = () => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center gap-5 p-5 bg-[#63f3f7]/5 border border-[#63f3f7]/10 rounded-2xl">
      <div className="text-5xl font-black text-white">4.9</div>
      <div>
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />)}
        </div>
        <p className="text-white/30 text-xs uppercase font-black tracking-widest">Средняя оценка покупателей</p>
      </div>
    </div>
    {[
      { name: "Александр К.", date: "18 апреля 2026", text: "Купил Elden Ring через турецкий регион — сэкономил почти 3000 рублей. Ключ пришёл мгновенно, всё активировалось без проблем! Буду покупать ещё.", rating: 5 },
      { name: "Мария П.", date: "15 апреля 2026", text: "Отличный магазин! Брала подписку PS Plus Extra — дешевле чем в российском сторе в 2 раза. Поддержка быстро ответила на все вопросы.", rating: 5 },
      { name: "Дмитрий В.", date: "10 апреля 2026", text: "Уже третья покупка, всё чётко. GTA V за 766 рублей — это просто огонь. Рекомендую всем кто хочет сэкономить на играх!", rating: 5 },
    ].map((review) => (
      <div key={review.name} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#63f3f7]/10 border border-[#63f3f7]/20 flex items-center justify-center">
              <span className="text-[#63f3f7] text-sm font-black">{review.name[0]}</span>
            </div>
            <div>
              <p className="text-white font-black text-sm">{review.name}</p>
              <p className="text-white/20 text-xs mt-0.5">{review.date}</p>
            </div>
          </div>
          <div className="flex gap-0.5">
            {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
          </div>
        </div>
        <p className="text-white/50 text-sm leading-relaxed">{review.text}</p>
      </div>
    ))}
  </div>
);

export const SupportContent = () => (
  <div className="flex flex-col gap-5">
    <p className="text-white/50 text-base">Мы готовы помочь с любым вопросом:</p>
    {[
      { q: "Как активировать карту PSN?", a: "После покупки вы получите код на почту. Зайдите в PS Store → Пополнить баланс → Введите код. Готово — средства зачислены!" },
      { q: "Какой регион выбрать?", a: "Турция дешевле всего — до 65% скидки. Индия на втором месте — до 45%. Оба региона работают с российскими картами." },
      { q: "Когда придёт ключ?", a: "Моментально после оплаты на указанную почту. Если не пришёл — проверьте папку спам или напишите нам в Telegram." },
      { q: "Можно вернуть деньги?", a: "Возврат возможен если ключ не был активирован. Напишите в поддержку в течение 24 часов после покупки." },
    ].map((item, i) => (
      <div key={i} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col gap-2">
        <p className="text-white font-black text-sm uppercase italic">{item.q}</p>
        <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
      </div>
    ))}
    <a href="https://t.me/clicps_bot" target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 py-4 bg-[#63f3f7] text-black rounded-2xl font-black text-sm uppercase italic tracking-widest hover:shadow-[0_0_20px_rgba(99,243,247,0.3)] transition-all"
    >
      <MessageCircle size={18} />
      Написать в Telegram бот
    </a>
  </div>
);

export const AgreementContent = () => (
  <div className="flex flex-col gap-4">
    {[
      { title: "1. Общие положения", text: "Настоящее соглашение регулирует отношения между CLIC STORE и пользователем при использовании сервиса покупки карт пополнения PlayStation Network." },
      { title: "2. Предмет соглашения", text: "CLIC STORE предоставляет услуги по продаже карт пополнения PSN для зарубежных регионов. Все коды являются официальными и приобретены легальным путём." },
      { title: "3. Права и обязанности", text: "Пользователь обязуется использовать приобретённые коды только для личного использования. Перепродажа кодов запрещена." },
      { title: "4. Возврат средств", text: "Возврат средств возможен в течение 24 часов с момента покупки при условии что код не был активирован. Для возврата обратитесь в поддержку." },
      { title: "5. Ответственность", text: "CLIC STORE не несёт ответственности за изменение цен в PlayStation Store, блокировку аккаунтов по причинам не связанным с покупкой кодов." },
    ].map((item) => (
      <div key={item.title} className="p-5 bg-white/[0.02] border border-white/5 rounded-xl">
        <p className="text-white font-black text-sm mb-2 uppercase italic">{item.title}</p>
        <p className="text-white/40 text-sm leading-relaxed">{item.text}</p>
      </div>
    ))}
  </div>
);

export const PrivacyContent = () => (
  <div className="flex flex-col gap-4">
    {[
      { title: "1. Сбор данных", text: "Мы собираем только необходимые данные: email для доставки ключей, данные авторизации через OAuth провайдеров (ВКонтакте, Яндекс)." },
      { title: "2. Использование данных", text: "Ваши данные используются исключительно для обработки заказов и доставки ключей. Мы не передаём данные третьим лицам." },
      { title: "3. Хранение данных", text: "Данные хранятся на защищённых серверах. История заказов хранится 1 год с момента последней покупки." },
      { title: "4. Cookie", text: "Сайт использует cookie для авторизации и хранения настроек региона. Вы можете отключить cookie в настройках браузера." },
      { title: "5. Ваши права", text: "Вы можете запросить удаление ваших данных в любое время, написав в поддержку @clic_support." },
    ].map((item) => (
      <div key={item.title} className="p-5 bg-white/[0.02] border border-white/5 rounded-xl">
        <p className="text-white font-black text-sm mb-2 uppercase italic">{item.title}</p>
        <p className="text-white/40 text-sm leading-relaxed">{item.text}</p>
      </div>
    ))}
  </div>
);