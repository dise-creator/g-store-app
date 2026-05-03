import { Telegraf, Markup } from "telegraf";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const bot = new Telegraf(process.env.BOT_TOKEN!);
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const SITE_URL = "https://clicps.ru";

// Кнопка меню (синяя кнопка рядом с полем ввода)
bot.telegram.setChatMenuButton({
  menuButton: {
    type: "web_app",
    text: "🛍 Магазин",
    web_app: { url: SITE_URL }
  }
});

// Reply keyboard (постоянные кнопки снизу)
const replyKeyboard = Markup.keyboard([
  ["🛍 Открыть магазин"],
  ["🎮 Каталог", "🛒 Корзина"],
  ["❤️ Избранное", "👤 Профиль"],
  ["💬 Поддержка"],
]).resize();

// Inline меню
const mainMenu = () =>
  Markup.inlineKeyboard([
    [Markup.button.webApp("🛍 ОТКРЫТЬ МАГАЗИН", SITE_URL)],
    [Markup.button.callback("🎮 КАТАЛОГ ИГР", "catalog")],
    [
      Markup.button.callback("🛒 КОРЗИНА", "cart"),
      Markup.button.callback("❤️ ИЗБРАННОЕ", "wishlist"),
    ],
    [
      Markup.button.callback("👤 ПРОФИЛЬ", "profile"),
      Markup.button.callback("💬 ПОДДЕРЖКА", "support"),
    ],
  ]);

bot.start(async (ctx) => {
  const name = ctx.from.first_name;

  try {
    await ctx.replyWithPhoto(
      { url: "https://clicps.ru/baner.png" },
      {
        caption: [
          `🎮 *CLIC STORE* — Цифровые ключи`,
          ``,
          `Привет, *${name}*\\! 👋`,
          ``,
          `Покупай карты пополнения *PlayStation Network*`,
          `по выгодным ценам через региональные аккаунты\\.`,
          ``,
          `🇹🇷 *Турция* — скидка до 65%`,
          `🇮🇳 *Индия* — скидка до 45%`,
          ``,
          `━━━━━━━━━━━━━━━━━━━`,
          `⚡️ Моментальная доставка на email`,
          `🔒 Официальные карты PSN`,
          `💰 Программа лояльности`,
          `🏆 Скидка до 15% постоянным клиентам`,
        ].join("\n"),
        parse_mode: "MarkdownV2",
        ...mainMenu(),
      }
    );
  } catch {
    await ctx.reply(
      [
        `🎮 *CLIC STORE* — Цифровые ключи`,
        ``,
        `Привет, *${name}*\\! 👋`,
        ``,
        `Покупай карты пополнения *PlayStation Network*`,
        `по выгодным ценам через региональные аккаунты\\.`,
        ``,
        `🇹🇷 *Турция* — скидка до 65%`,
        `🇮🇳 *Индия* — скидка до 45%`,
        ``,
        `━━━━━━━━━━━━━━━━━━━`,
        `⚡️ Моментальная доставка на email`,
        `🔒 Официальные карты PSN`,
        `💰 Программа лояльности`,
        `🏆 Скидка до 15% постоянным клиентам`,
      ].join("\n"),
      {
        parse_mode: "MarkdownV2",
        ...mainMenu(),
      }
    );
  }

  // Показываем постоянные кнопки снизу
  await ctx.reply("Выбери раздел:", replyKeyboard);
});

// Обработчики reply keyboard
bot.hears("🛍 Открыть магазин", async (ctx) => {
  await ctx.reply(
    "Открываю магазин\\!",
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard([
        [Markup.button.webApp("🛍 Открыть магазин", SITE_URL)],
      ]),
    }
  );
});

bot.hears("🎮 Каталог", async (ctx) => {
  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !games || games.length === 0) {
    return ctx.reply("😔 Игры не найдены");
  }

  await ctx.reply(
    "🎮 *КАТАЛОГ ИГР*\n━━━━━━━━━━━━━━━\nВыбери игру:",
    { parse_mode: "Markdown" }
  );

  for (const game of games) {
    const price = game.discount_percent
      ? Math.round(game.price * (1 - game.discount_percent / 100))
      : game.price;

    const caption = [
      `🎮 *${game.title}*`,
      game.discount_percent ? `🔥 *Скидка ${game.discount_percent}%*` : "",
      `💰 *${price.toLocaleString()} ₽*`,
      `📝 ${game.shortDescription || ""}`,
    ].filter(Boolean).join("\n");

    try {
      await ctx.replyWithPhoto(
        { url: game.image },
        {
          caption,
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard([
            [Markup.button.webApp(`🛍 Купить за ${price.toLocaleString()} ₽`, SITE_URL)],
            [Markup.button.callback("🛒 В корзину", `add_${game.id}`)],
          ]),
        }
      );
    } catch {
      await ctx.reply(caption, {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.webApp(`🛍 Купить за ${price.toLocaleString()} ₽`, SITE_URL)],
          [Markup.button.callback("🛒 В корзину", `add_${game.id}`)],
        ]),
      });
    }
  }
});

bot.hears("🛒 Корзина", async (ctx) => {
  const userId = ctx.from.id;
  const { data: cartItems } = await supabase
    .from("tg_cart")
    .select("*")
    .eq("telegram_id", userId);

  if (!cartItems || cartItems.length === 0) {
    return ctx.reply(
      "🛒 *Корзина пуста*\n\nДобавь игры из каталога\\!",
      {
        parse_mode: "MarkdownV2",
        ...Markup.inlineKeyboard([
          [Markup.button.webApp("🛍 Открыть магазин", SITE_URL)],
        ]),
      }
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.game_price * item.quantity, 0
  );

  const text = [
    `🛒 *ВАША КОРЗИНА*`,
    `━━━━━━━━━━━━━━━`,
    ...cartItems.map(
      (i) => `🎮 *${i.game_title}*\n   × ${i.quantity} шт — *${(i.game_price * i.quantity).toLocaleString()} ₽*`
    ),
    `━━━━━━━━━━━━━━━`,
    `💰 *Итого: ${total.toLocaleString()} ₽*`,
  ].join("\n");

  await ctx.reply(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.webApp("💳 Оформить заказ", SITE_URL)],
      [Markup.button.callback("🗑 Очистить корзину", "clear_cart")],
    ]),
  });
});

bot.hears("❤️ Избранное", async (ctx) => {
  await ctx.reply(
    "❤️ *ИЗБРАННОЕ*\n\nТвой список синхронизирован с сайтом\\.",
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard([
        [Markup.button.webApp("❤️ Открыть избранное", SITE_URL + "/wishlist")],
      ]),
    }
  );
});

bot.hears("👤 Профиль", async (ctx) => {
  await ctx.reply(
    "👤 *МОЙ ПРОФИЛЬ*\n\nИстория заказов, ключи и бонусы\\.",
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard([
        [Markup.button.webApp("👤 Открыть профиль", SITE_URL + "/profile")],
      ]),
    }
  );
});

bot.hears("💬 Поддержка", async (ctx) => {
  await ctx.reply(
    "💬 *ПОДДЕРЖКА*\n\nОтвечаем в течение 30 минут\\.",
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard([
        [Markup.button.url("💬 Написать в поддержку", "https://t.me/clic_support")],
      ]),
    }
  );
});

// Inline actions
bot.action("catalog", async (ctx) => {
  await ctx.answerCbQuery();
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  if (!games || games.length === 0) return ctx.reply("😔 Игры не найдены");

  await ctx.reply("🎮 *КАТАЛОГ ИГР*", { parse_mode: "Markdown" });

  for (const game of games) {
    const price = game.discount_percent
      ? Math.round(game.price * (1 - game.discount_percent / 100))
      : game.price;

    const caption = [
      `🎮 *${game.title}*`,
      game.discount_percent ? `🔥 *Скидка ${game.discount_percent}%*` : "",
      `💰 *${price.toLocaleString()} ₽*`,
      `📝 ${game.shortDescription || ""}`,
    ].filter(Boolean).join("\n");

    try {
      await ctx.replyWithPhoto(
        { url: game.image },
        {
          caption,
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard([
            [Markup.button.webApp(`🛍 Купить за ${price.toLocaleString()} ₽`, SITE_URL)],
            [Markup.button.callback("🛒 В корзину", `add_${game.id}`)],
          ]),
        }
      );
    } catch {
      await ctx.reply(caption, {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.webApp(`🛍 Купить за ${price.toLocaleString()} ₽`, SITE_URL)],
          [Markup.button.callback("🛒 В корзину", `add_${game.id}`)],
        ]),
      });
    }
  }
});

bot.action(/^add_(.+)$/, async (ctx) => {
  await ctx.answerCbQuery("✅ Добавлено!");
  const gameId = ctx.match[1];
  const userId = ctx.from.id;

  const { data: game } = await supabase
    .from("games").select("*").eq("id", gameId).single();

  if (!game) return;

  const price = game.discount_percent
    ? Math.round(game.price * (1 - game.discount_percent / 100))
    : game.price;

  const { data: existing } = await supabase
    .from("tg_cart").select("*")
    .eq("telegram_id", userId).eq("game_id", gameId).single();

  if (existing) {
    await supabase.from("tg_cart")
      .update({ quantity: existing.quantity + 1 }).eq("id", existing.id);
  } else {
    await supabase.from("tg_cart").insert({
      telegram_id: userId,
      game_id: gameId,
      game_title: game.title,
      game_price: price,
      game_image: game.image,
      quantity: 1,
    });
  }

  await ctx.reply(
    `✅ *${game.title}* добавлен в корзину\\!`,
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🛒 Корзина", "cart")],
        [Markup.button.callback("🎮 Продолжить", "catalog")],
      ]),
    }
  );
});

bot.action("cart", async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  const { data: cartItems } = await supabase
    .from("tg_cart").select("*").eq("telegram_id", userId);

  if (!cartItems || cartItems.length === 0) {
    return ctx.reply("🛒 *Корзина пуста*", {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.webApp("🛍 Открыть магазин", SITE_URL)],
      ]),
    });
  }

  const total = cartItems.reduce((sum, i) => sum + i.game_price * i.quantity, 0);
  const text = [
    `🛒 *КОРЗИНА*\n━━━━━━━━━━━━━━━`,
    ...cartItems.map(i => `🎮 *${i.game_title}* × ${i.quantity} — *${(i.game_price * i.quantity).toLocaleString()} ₽*`),
    `━━━━━━━━━━━━━━━\n💰 *Итого: ${total.toLocaleString()} ₽*`,
  ].join("\n");

  await ctx.reply(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.webApp("💳 Оформить заказ", SITE_URL)],
      [Markup.button.callback("🗑 Очистить", "clear_cart")],
    ]),
  });
});

bot.action("clear_cart", async (ctx) => {
  await ctx.answerCbQuery();
  await supabase.from("tg_cart").delete().eq("telegram_id", ctx.from.id);
  await ctx.reply("🗑 *Корзина очищена*", { parse_mode: "Markdown" });
});

bot.action("wishlist", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("❤️ Избранное:", Markup.inlineKeyboard([
    [Markup.button.webApp("❤️ Открыть избранное", SITE_URL + "/wishlist")],
  ]));
});

bot.action("profile", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("👤 Профиль:", Markup.inlineKeyboard([
    [Markup.button.webApp("👤 Открыть профиль", SITE_URL + "/profile")],
  ]));
});

bot.action("support", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("💬 Поддержка:", Markup.inlineKeyboard([
    [Markup.button.url("💬 Написать", "https://t.me/clic_support")],
  ]));
});

bot.action("back_home", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("Главное меню:", mainMenu());
});

bot.launch();
console.log("🤖 CLIC BOT запущен!");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));