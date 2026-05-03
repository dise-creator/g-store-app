import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { initData } = await req.json();

  if (!initData) {
    return NextResponse.json({ error: "No init data" }, { status: 400 });
  }

  // Проверяем подпись от Telegram
  const token = process.env.TELEGRAM_BOT_TOKEN!.trim();
  const secretKey = crypto.createHmac("sha256", "WebAppData").update(token).digest();

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");

  const checkString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  if (hmac !== hash) {
    return NextResponse.json({ error: "Invalid hash" }, { status: 401 });
  }

  // Парсим данные пользователя
  const userStr = params.get("user");
  if (!userStr) {
    return NextResponse.json({ error: "No user data" }, { status: 400 });
  }

  const tgUser = JSON.parse(userStr);

  // Ищем или создаём пользователя по telegram_id
  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("provider_id", String(tgUser.id))
    .eq("provider", "telegram")
    .single();

  if (existingUser) {
    return NextResponse.json({ ok: true, email: existingUser.email, telegramId: String(tgUser.id) });
  }

  // Новый пользователь — нужен email
  return NextResponse.json({ ok: false, needEmail: true, telegramId: String(tgUser.id), name: tgUser.first_name, photo: tgUser.photo_url });
}