"use client";

import React from "react";
import { MessageCircle, Star, Shield, Zap, Award } from "lucide-react";

export const AboutContent = () => (
  <div className="space-y-6 text-white/80">
    <p>
      CLIC STORE — магазин карт пополнения PlayStation Network с моментальной доставкой. 
      Мы работаем с 2024 года и помогаем геймерам покупать игры по выгодным ценам через зарубежные регионы.
    </p>

    <div className="grid grid-cols-1 gap-4">
      {[
        { icon: Zap, label: "Моментальная доставка", desc: "Ключи приходят на почту мгновенно после оплаты" },
        { icon: Shield, label: "Безопасно", desc: "Только официальные карты PSN от проверенных источников" },
        { icon: MessageCircle, label: "Работаем 24/7", desc: "Поддержка доступна в любое время суток" },
        { icon: Award, label: "1000+ клиентов", desc: "Довольных покупателей за всё время работы" },
      ].map((item, i) => (
        <div key={i} className="flex gap-3">
          <item.icon className="w-5 h-5 text-[#ff6b00] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-white">{item.label}</p>
            <p className="text-sm text-white/60">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <p>
      Мы предлагаем карты пополнения PSN по ценам турецкого 🇹🇷 и индийского 🇮🇳 регионов — 
      это позволяет экономить до <span className="text-[#ff6b00] font-bold">65%</span> на покупке игр и подписок PS Plus.
    </p>
  </div>
);

export const ContactsContent = () => (
  <div className="space-y-6 text-white/80">
    <p>Свяжитесь с нами любым удобным способом:</p>

    <div className="space-y-4">
      {[
        { label: "Telegram бот", value: "@clicps_bot", href: "https://t.me/clicps_bot" },
        { label: "Поддержка Telegram", value: "@clic_support", href: "https://t.me/clic_support" },
        { label: "VK сообщество", value: "vk.com/clicstore", href: "https://vk.com/clicstore" },
        { label: "Email", value: "support@clicstore.ru", href: "mailto:support@clicstore.ru" },
      ].map((item, i) => (
        <a
          key={i}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all border border-white/10 hover:border-[#ff6b00]/30"
        >
          <p className="text-white font-medium">{item.label}</p>
          <p className="text-[#ff6b00]">{item.value}</p>
        </a>
      ))}
    </div>

    <div className="pt-4 border-t border-white/10">
      <p className="text-white/60">Время ответа</p>
      <p className="text-white">Обычно отвечаем в течение 15 минут</p>
    </div>
  </div>
);

export const ReviewsContent = () => (
  <div className="space-y-8">
    <div className="flex items-center gap-4">
      <div className="text-5xl font-black text-white">4.9</div>
      <div>
        <div className="flex text-[#ff6b00]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 fill-current" />
          ))}
        </div>
        <p className="text-white/60 text-sm mt-1">Средняя оценка покупателей</p>
      </div>
    </div>

    <div className="space-y-6">
      {[
        {
          name: "Александр К.",
          date: "18 апреля 2026",
          text: "Купил Elden Ring через турецкий регион — сэкономил почти 3000 рублей. Ключ пришёл мгновенно, всё активировалось без проблем!",
          rating: 5,
        },
        {
          name: "Мария П.",
          date: "15 апреля 2026",
          text: "Отличный магазин! Брала подписку PS Plus Extra — дешевле чем в российском сторе в 2 раза. Поддержка быстро ответила.",
          rating: 5,
        },
        {
          name: "Дмитрий В.",
          date: "10 апреля 2026",
          text: "Уже третья покупка, всё чётко. GTA V за 766 рублей — это просто огонь. Рекомендую всем!",
          rating: 5,
        },
      ].map((review, i) => (
        <div key={i} className="bg-white/5 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-medium text-white">{review.name}</p>
              <p className="text-white/40 text-xs">{review.date}</p>
            </div>
            <div className="flex text-[#ff6b00]">
              {[...Array(review.rating)].map((_, k) => (
                <Star key={k} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{review.text}</p>
        </div>
      ))}
    </div>
  </div>
);

export const SupportContent = () => (
  <div className="space-y-6">
    <p className="text-white/80">Мы готовы помочь с любым вопросом:</p>

    <div className="space-y-5">
      {[
        {
          q: "Как активировать карту PSN?",
          a: "После покупки вы получите код на почту. Зайдите в PS Store → Пополнить баланс → Введите код.",
        },
        {
          q: "Какой регион выбрать?",
          a: "Турция — самый выгодный (до 65% скидки). Индия — на втором месте (до 45%).",
        },
        {
          q: "Когда придёт ключ?",
          a: "Моментально после оплаты. Если не пришёл — проверьте папку «Спам» или напишите в поддержку.",
        },
        {
          q: "Можно вернуть деньги?",
          a: "Возврат возможен в течение 24 часов, если код не был активирован.",
        },
      ].map((item, i) => (
        <div key={i} className="bg-white/5 p-5 rounded-2xl">
          <p className="font-medium text-white mb-2">{item.q}</p>
          <p className="text-white/70 text-sm">{item.a}</p>
        </div>
      ))}
    </div>

    <div className="pt-4">
      <a
        href="https://t.me/clic_support"
        target="_blank"
        className="block w-full bg-[#ff6b00] hover:bg-[#ff8533] text-center py-4 rounded-2xl font-bold text-black transition-colors"
      >
        Написать в Telegram поддержку
      </a>
    </div>
  </div>
);

export const AgreementContent = () => (
  <div className="space-y-8 text-white/80 text-sm">
    {[
      {
        title: "1. Общие положения",
        text: "Настоящее соглашение регулирует отношения между CLIC STORE и пользователем при использовании сервиса покупки карт пополнения PlayStation Network.",
      },
      {
        title: "2. Предмет соглашения",
        text: "CLIC STORE предоставляет услуги по продаже карт пополнения PSN для зарубежных регионов. Все коды являются официальными.",
      },
      {
        title: "3. Права и обязанности",
        text: "Пользователь обязуется использовать приобретённые коды только для личного использования. Перепродажа запрещена.",
      },
      {
        title: "4. Возврат средств",
        text: "Возврат возможен в течение 24 часов с момента покупки при условии, что код не был активирован.",
      },
      {
        title: "5. Ответственность",
        text: "CLIC STORE не несёт ответственности за изменение цен в PlayStation Store и блокировку аккаунтов по причинам, не связанным с покупкой.",
      },
    ].map((item, i) => (
      <div key={i}>
        <h3 className="font-bold text-white mb-2">{item.title}</h3>
        <p>{item.text}</p>
      </div>
    ))}
  </div>
);

export const PrivacyContent = () => (
  <div className="space-y-8 text-white/80 text-sm">
    {[
      {
        title: "1. Сбор данных",
        text: "Мы собираем только необходимые данные: email для доставки ключей и данные авторизации.",
      },
      {
        title: "2. Использование данных",
        text: "Ваши данные используются исключительно для обработки заказов и доставки ключей.",
      },
      {
        title: "3. Хранение данных",
        text: "Данные хранятся на защищённых серверах. История заказов хранится 1 год.",
      },
      {
        title: "4. Cookie",
        text: "Сайт использует cookie для авторизации и хранения настроек региона.",
      },
      {
        title: "5. Ваши права",
        text: "Вы можете запросить удаление ваших данных в любое время, написав в поддержку @clic_support.",
      },
    ].map((item, i) => (
      <div key={i}>
        <h3 className="font-bold text-white mb-2">{item.title}</h3>
        <p>{item.text}</p>
      </div>
    ))}
  </div>
);