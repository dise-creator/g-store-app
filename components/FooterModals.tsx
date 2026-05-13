"use client";

import React from "react";
import { MessageCircle, Star, Shield, Zap, Award, Clock, Package, RefreshCw, Users, TrendingUp, CheckCircle } from "lucide-react";

export const AboutContent = () => (
  <div className="flex flex-col gap-6">
    <p className="text-white/60 text-base leading-relaxed">
      <span className="text-white font-black">CLIC STORE</span> — магазин карт пополнения PlayStation Network с моментальной доставкой. Мы работаем с 2024 года и помогаем геймерам покупать игры и подписки по выгодным ценам через зарубежные регионы PSN.
    </p>

    <div className="grid grid-cols-2 gap-4">
      {[
        { icon: Zap, label: "Моментальная доставка", desc: "Ключи приходят на почту мгновенно после оплаты — без ожидания" },
        { icon: Shield, label: "Официальные карты", desc: "Только легальные карты PSN от проверенных поставщиков" },
        { icon: Clock, label: "Работаем 24/7", desc: "Поддержка и автоматическая выдача ключей круглосуточно" },
        { icon: Users, label: "5000+ клиентов", desc: "Довольных покупателей за всё время работы магазина" },
        { icon: TrendingUp, label: "Скидки до 65%", desc: "Экономия по сравнению с официальным российским магазином" },
        { icon: Package, label: "Все регионы", desc: "Турция, Индия — выбирай выгодный регион для себя" },
      ].map((item) => (
        <div key={item.label} className="p-4 bg-[#0a1860]/60 border border-[#ff6b00]/30 rounded-2xl flex flex-col gap-2">
          <item.icon size={20} className="text-[#ff6b00]" />
          <p className="text-white font-black text-xs uppercase">{item.label}</p>
          <p className="text-white/30 text-xs leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>

    <div className="p-5 bg-[#ff6b00]/5 border border-[#ff6b00]/10 rounded-2xl">
      <p className="text-white font-black text-sm uppercase mb-3">Как это работает?</p>
      <div className="flex flex-col gap-3">
        {[
          "Выбираешь игру или подписку в каталоге",
          "Указываешь email для получения ключа",
          "Оплачиваешь удобным способом",
          "Получаешь код на почту мгновенно",
          "Активируешь в PS Store и играешь!",
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#ff6b00] flex items-center justify-center shrink-0">
              <span className="text-black text-[10px] font-black">{i + 1}</span>
            </div>
            <p className="text-white/50 text-sm">{step}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="p-5 bg-[#0a1860]/60 border border-[#ff6b00]/30 rounded-2xl">
      <p className="text-white/50 text-sm leading-relaxed">
        Мы предлагаем карты пополнения PSN по ценам турецкого 🇹🇷 и индийского 🇮🇳 регионов — это позволяет экономить до <span className="text-[#ff6b00] font-black">65%</span> на покупке игр и подписок PS Plus по сравнению с российским магазином.
      </p>
    </div>
  </div>
);

export const ContactsContent = () => (
  <div className="flex flex-col gap-5">
    <p className="text-white/50 text-base">Свяжитесь с нами любым удобным способом — отвечаем быстро!</p>
    {[
      { label: "Telegram бот", value: "@clicps_bot", desc: "Автоматический бот для покупок и получения ключей", color: "#229ed9", href: "https://t.me/clicps_bot" },
      { label: "Поддержка Telegram", value: "@clic_support", desc: "Живая поддержка по всем вопросам", color: "#229ed9", href: "https://t.me/clic_support" },
      { label: "VK сообщество", value: "vk.com/clicstore", desc: "Новости, акции и обновления магазина", color: "#0077ff", href: "https://vk.com" },
      { label: "Email", value: "support@clicstore.ru", desc: "Для официальных обращений", color: "#ff6b00", href: "mailto:support@clicstore.ru" },
    ].map((item) => (
      <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between p-5 bg-[#0a1860]/60 hover:bg-white/[0.06] border border-[#ff6b00]/30 hover:border-[#ff6b00]/40 rounded-2xl transition-all group">
        <div className="flex flex-col gap-1">
          <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">{item.label}</p>
          <p className="font-black text-base" style={{ color: item.color }}>{item.value}</p>
          <p className="text-white/30 text-xs">{item.desc}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all shrink-0">
          <MessageCircle size={18} className="text-white/30 group-hover:text-white/60" />
        </div>
      </a>
    ))}
    <div className="p-5 bg-[#0a1860]/40 border border-[#ff6b00]/30 rounded-2xl flex items-center gap-4">
      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
      <div>
        <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mb-0.5">Время ответа</p>
        <p className="text-white/50 text-sm">Обычно отвечаем в течение <span className="text-[#ff6b00] font-black">15 минут</span> — работаем 24/7</p>
      </div>
    </div>
  </div>
);

export const ReviewsContent = () => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center gap-5 p-5 bg-[#ff6b00]/5 border border-[#ff6b00]/10 rounded-2xl">
      <div className="text-5xl font-black text-white">4.9</div>
      <div>
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />)}
        </div>
        <p className="text-white/30 text-xs uppercase font-black tracking-widest">Средняя оценка</p>
        <p className="text-white/20 text-xs mt-0.5">на основе 500+ отзывов</p>
      </div>
    </div>

    {[
      { name: "Александр К.", date: "18 апреля 2026", text: "Купил Elden Ring через турецкий регион — сэкономил почти 3000 рублей. Ключ пришёл мгновенно, всё активировалось без проблем! Буду покупать ещё.", rating: 5 },
      { name: "Мария П.", date: "15 апреля 2026", text: "Отличный магазин! Брала подписку PS Plus Extra — дешевле чем в российском сторе в 2 раза. Поддержка быстро ответила на все вопросы.", rating: 5 },
      { name: "Дмитрий В.", date: "10 апреля 2026", text: "Уже третья покупка, всё чётко. GTA V за 766 рублей — это просто огонь. Рекомендую всем кто хочет сэкономить на играх!", rating: 5 },
      { name: "Никита С.", date: "5 апреля 2026", text: "Быстро, удобно, дёшево. Купил Spider-Man 2 за треть цены. Код пришёл на почту за 10 секунд. Магазин огонь!", rating: 5 },
      { name: "Анна Р.", date: "1 апреля 2026", text: "Пополнила баланс PSN через индийский регион. Всё прошло гладко, поддержка помогла разобраться с регионом за 5 минут.", rating: 5 },
    ].map((review) => (
      <div key={review.name} className="p-5 bg-[#0a1860]/60 border border-[#ff6b00]/30 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/40 flex items-center justify-center">
              <span className="text-[#ff6b00] text-sm font-black">{review.name[0]}</span>
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
    <p className="text-white/50 text-base">Мы готовы помочь с любым вопросом — отвечаем быстро!</p>
    {[
      { q: "Как активировать карту PSN?", a: "После покупки вы получите код на почту. Зайдите в PS Store → Пополнить баланс → Введите код. Готово — средства зачислены на аккаунт!" },
      { q: "Какой регион выбрать?", a: "Турция дешевле всего — до 65% скидки. Индия на втором месте — до 45%. Оба региона работают с российскими картами оплаты." },
      { q: "Когда придёт ключ?", a: "Моментально после оплаты на указанную почту. Если не пришёл в течение 5 минут — проверьте папку спам или напишите нам в Telegram." },
      { q: "Можно вернуть деньги?", a: "Возврат возможен если ключ не был активирован. Напишите в поддержку в течение 24 часов после покупки с номером заказа." },
      { q: "Работает ли с PS5 и PS4?", a: "Да! Карты PSN работают на всех консолях PlayStation — PS4, PS5, а также через приложение на телефоне и браузере." },
      { q: "Нужен ли аккаунт нужного региона?", a: "Для пополнения баланса через карту — нет. Но для покупки игр конкретного региона может потребоваться аккаунт этого региона. Напишите нам — подскажем!" },
    ].map((item, i) => (
      <div key={i} className="p-5 bg-[#0a1860]/60 border border-[#ff6b00]/30 rounded-2xl flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <CheckCircle size={16} className="text-[#ff6b00] shrink-0 mt-0.5" />
          <p className="text-white font-black text-sm uppercase">{item.q}</p>
        </div>
        <p className="text-white/50 text-sm leading-relaxed pl-7">{item.a}</p>
      </div>
    ))}
    <a href="https://t.me/clicps_bot" target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 py-4 bg-[#ff6b00] text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all">
      <MessageCircle size={18} />
      Написать в Telegram бот
    </a>
  </div>
);

export const AgreementContent = () => (
  <div className="flex flex-col gap-4">
    <p className="text-white/30 text-xs">Последнее обновление: 1 января 2026 года</p>
    {[
      { title: "1. Общие положения", text: "Настоящее соглашение регулирует отношения между CLIC STORE и пользователем при использовании сервиса покупки карт пополнения PlayStation Network. Используя сервис, вы принимаете условия данного соглашения." },
      { title: "2. Предмет соглашения", text: "CLIC STORE предоставляет услуги по продаже карт пополнения PSN для зарубежных регионов (Турция, Индия). Все коды являются официальными и приобретены легальным путём у авторизованных дистрибьюторов." },
      { title: "3. Права и обязанности", text: "Пользователь обязуется использовать приобретённые коды только для личного использования. Перепродажа кодов без письменного согласия CLIC STORE запрещена." },
      { title: "4. Возврат средств", text: "Возврат средств возможен в течение 24 часов с момента покупки при условии что код не был активирован. Для возврата обратитесь в поддержку @clic_support с номером заказа." },
      { title: "5. Ответственность", text: "CLIC STORE не несёт ответственности за изменение цен в PlayStation Store, блокировку аккаунтов по причинам не связанным с покупкой кодов, а также за технические сбои на стороне PlayStation Network." },
      { title: "6. Конфиденциальность", text: "Ваши персональные данные обрабатываются в соответствии с Политикой конфиденциальности. Мы не передаём данные третьим лицам без вашего согласия." },
    ].map((item) => (
      <div key={item.title} className="p-5 bg-[#0a1860]/40 border border-[#ff6b00]/30 rounded-xl">
        <p className="text-white font-black text-sm mb-2 uppercase">{item.title}</p>
        <p className="text-white/40 text-sm leading-relaxed">{item.text}</p>
      </div>
    ))}
  </div>
);

export const PrivacyContent = () => (
  <div className="flex flex-col gap-4">
    <p className="text-white/30 text-xs">Последнее обновление: 1 января 2026 года</p>
    {[
      { title: "1. Сбор данных", text: "Мы собираем только необходимые данные: email для доставки ключей, данные авторизации через OAuth провайдеров (ВКонтакте, Яндекс), историю заказов для поддержки." },
      { title: "2. Использование данных", text: "Ваши данные используются исключительно для обработки заказов и доставки ключей. Мы не продаём и не передаём данные третьим лицам в маркетинговых целях." },
      { title: "3. Хранение данных", text: "Данные хранятся на защищённых серверах с шифрованием. История заказов хранится 1 год с момента последней покупки, после чего автоматически удаляется." },
      { title: "4. Cookie", text: "Сайт использует cookie для авторизации и хранения настроек региона. Вы можете отключить cookie в настройках браузера, однако это может повлиять на функциональность сайта." },
      { title: "5. Ваши права", text: "Вы можете запросить копию, исправление или удаление ваших данных в любое время, написав в поддержку @clic_support. Запрос обрабатывается в течение 7 рабочих дней." },
    ].map((item) => (
      <div key={item.title} className="p-5 bg-[#0a1860]/40 border border-[#ff6b00]/30 rounded-xl">
        <p className="text-white font-black text-sm mb-2 uppercase">{item.title}</p>
        <p className="text-white/40 text-sm leading-relaxed">{item.text}</p>
      </div>
    ))}
  </div>
);