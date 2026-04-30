import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.TELEGRAM_ADMIN_ID;
const ADMIN_ID_2 = process.env.TELEGRAM_ADMIN_ID_2;
const ADMIN_ID_3 = process.env.TELEGRAM_ADMIN_ID_3;

export async function POST(req: NextRequest) {
  console.log("BOT_TOKEN:", BOT_TOKEN ? "✅ есть" : "❌ нет");
  console.log("ADMIN_ID:", ADMIN_ID ? "✅ есть" : "❌ нет");
  console.log("ADMIN_ID_2:", ADMIN_ID_2 ? "✅ есть" : "❌ нет");
  console.log("ADMIN_ID_3:", ADMIN_ID_3 ? "✅ есть" : "❌ нет");

  try {
    const { orderId, items, total, email, vouchers } = await req.json();

    const itemsList = items
      .map((item: any) =>
        `🎮 ${item.title} x${item.quantity} — ${item.price * item.quantity} руб`
      )
      .join("\n");

    const vouchersList =
      vouchers?.length > 0
        ? vouchers.map((v: any) => `🔑 ${v.game_title}: ${v.code}`).join("\n")
        : "Ключи не найдены";

    const message = [
      `💰 НОВЫЙ ЗАКАЗ!`,
      `━━━━━━━━━━━━━━━`,
      `📧 Email: ${email}`,
      `🆔 Заказ: ${orderId.slice(0, 8).toUpperCase()}`,
      ``,
      `Товары:`,
      itemsList,
      ``,
      `Ключи:`,
      vouchersList,
      `━━━━━━━━━━━━━━━`,
      `💵 Итого: ${total} руб`,
    ].join("\n");

    const recipients = [ADMIN_ID, ADMIN_ID_2, ADMIN_ID_3].filter(Boolean);

    for (const chatId of recipients) {
      const tgRes = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        }
      );

      const tgData = await tgRes.json();
      console.log(`Telegram response [${chatId}]:`, JSON.stringify(tgData));

      if (!tgData.ok) {
        console.error(`Telegram error [${chatId}]:`, JSON.stringify(tgData));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Notify catch error:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}