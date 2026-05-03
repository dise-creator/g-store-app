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
      { url: "https://clicps.ru/hero/1.jpg" },
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
});

bot.action("catalog", async (ctx) => {
  await ctx.answerCbQuery();

  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !games || games.length === 0) {
    return ctx.reply("😔 Игры не найдены", mainMenu());
  }

  await ctx.reply(
    "🎮 *КАТАЛОГ ИГР*\n━━━━━━━━━━━━━━━\nВыбери игру для покупки:",
    { parse_mode: "Markdown" }
  );

  for (const game of games) {
    const discount = game.discount_percent ? `\n🔥 *Скидка ${game.discount_percent}%*` : "";
    const price = game.discount_percent
      ? Math.round(game.price * (1 - game.discount_percent / 100))
      : game.price;

    const caption = [
      `🎮 *${game.title}*`,
      `━━━━━━━━━━━━━━━`,
      discount,
      `💰 Цена: *${price.toLocaleString()} ₽*`,
      game.discount_percent ? `~Без скидки: ${game.price.toLocaleString()} ₽~` : "",
      ``,
      `📝 ${game.shortDescription || "Описание отсутствует"}`,
    ].filter(Boolean).join("\n");

    try {
      await ctx.replyWithPhoto(
        { url: game.image },
        {
          caption,
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard([
            [Markup.button.webApp(`🛍 Купить за ${price.toLocaleString()} ₽`, SITE_URL)],
            [Markup.button.callback(`🛒 В корзину бота`, `add_${game.id}`)],
          ]),
        }
      );
    } catch {
      await ctx.reply(caption, {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.webApp(`🛍 Купить за ${price.toLocaleString()} ₽`, SITE_URL)],
          [Markup.button.callback(`🛒 В корзину бота`, `add_${game.id}`)],
        ]),
      });
    }
  }

  await ctx.reply(
    "⬆️ Выбери игру выше или открой полный каталог на сайте",
    Markup.inlineKeyboard([
      [Markup.button.webApp("🛍 Полный каталог", SITE_URL)],
      [Markup.button.callback("⬅️ Главное меню", "back_home")],
    ])
  );
});

bot.action(/^add_(.+)$/, async (ctx) => {
  await ctx.answerCbQuery("✅ Добавлено в корзину!");
  const gameId = ctx.match[1];
  const userId = ctx.from.id;

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (!game) return;

  const price = game.discount_percent
    ? Math.round(game.price * (1 - game.discount_percent / 100))
    : game.price;

  const { data: existing } = await supabase
    .from("tg_cart")
    .select("*")
    .eq("telegram_id", userId)
    .eq("game_id", gameId)
    .single();

  if (existing) {
    await supabase
      .from("tg_cart")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);
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
        [Markup.button.callback("🛒 Перейти в корзину", "cart")],
        [Markup.button.callback("🎮 Продолжить покупки", "catalog")],
      ]),
    }
  );
});

bot.action("cart", async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;

  const { data: cartItems } = await supabase
    .from("tg_cart")
    .select("*")
    .eq("telegram_id", userId);

  if (!cartItems || cartItems.length === 0) {
    return ctx.reply(
      "🛒 *Корзина пуста*\n\nДобавь игры из каталога или купи прямо на сайте\\!",
      {
        parse_mode: "MarkdownV2",
        ...Markup.inlineKeyboard([
          [Markup.button.webApp("🛍 Открыть магазин", SITE_URL)],
          [Markup.button.callback("🎮 Каталог", "catalog")],
          [Markup.button.callback("⬅️ Главное меню", "back_home")],
        ]),
      }
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.game_price * item.quantity,
    0
  );

  const text = [
    `🛒 *ВАША КОРЗИНА*`,
    `━━━━━━━━━━━━━━━`,
    ...cartItems.map(
      (i) => `🎮 *${i.game_title}*\n   × ${i.quantity} шт — *${(i.game_price * i.quantity).toLocaleString()} ₽*`
    ),
    `━━━━━━━━━━━━━━━`,
    `💰 *Итого: ${total.toLocaleString()} ₽*`,
    ``,
    `Для оформления заказа перейди на сайт\\.`,
  ].join("\n");

  await ctx.reply(text, {
    parse_mode: "MarkdownV2",
    ...Markup.inlineKeyboard([
      [Markup.button.webApp("💳 Оформить заказ", SITE_URL)],
      [Markup.button.callback("🗑 Очистить корзину", "clear_cart")],
      [Markup.button.callback("🎮 Продолжить покупки", "catalog")],
      [Markup.button.callback("⬅️ Главное меню", "back_home")],
    ]),
  });
});

bot.action("clear_cart", async (ctx) => {
  await ctx.answerCbQuery();
  await supabase.from("tg_cart").delete().eq("telegram_id", ctx.from.id);
  await ctx.reply(
    "🗑 *Корзина очищена*",
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🎮 Каталог", "catalog")],
        [Markup.button.callback("⬅️ Главное меню", "back_home")],
      ]),
    }
  );
});

bot.action("wishlist", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    [
      `❤️ *ИЗБРАННОЕ*`,
      ``,
      `Твой список избранного синхронизирован с сайтом\\.`,
      `Открой магазин чтобы управлять списком и купить игры\\.`,
    ].join("\n"),
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard([
        [Markup.button.webApp("🛍 Открыть магазин", SITE_URL)],
        [Markup.button.callback("⬅️ Главное меню", "back_home")],
      ]),
    }
  );
});

bot.action("profile", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    [
      `👤 *МОЙ ПРОФИЛЬ*`,
      ``,
      `Управляй профилем, смотри историю заказов`,
      `и свои ключи активации на сайте\\.`,
    ].join("\n"),
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard([
        [Markup.button.webApp("👤 Открыть профиль", `${SITE_URL}/profile`)],
        [Markup.button.callback("⬅️ Главное меню", "back_home")],
      ]),
    }
  );
});

bot.action("support", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    [
      `💬 *ПОДДЕРЖКА*`,
      ``,
      `Есть вопросы? Мы поможем\\!`,
      ``,
      `📧 Напиши нам в чат поддержки`,
      `⏰ Отвечаем в течение 30 минут`,
    ].join("\n"),
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard([
        [Markup.button.url("💬 Написать в поддержку", "https://t.me/clic_support")],
        [Markup.button.callback("⬅️ Главное меню", "back_home")],
      ]),
    }
  );
});

bot.action("back_home", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("Главное меню:", mainMenu());
});

bot.launch();
console.log("🤖 CLIC BOT запущен!");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));