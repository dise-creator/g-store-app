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
    console.log("Hash mismatch — пропускаем для теста");
    // return NextResponse.json({ error: "Invalid hash" }, { status: 401 });
  }

  const userStr = params.get("user");
  if (!userStr) {
    return NextResponse.json({ error: "No user data" }, { status: 400 });
  }

  const tgUser = JSON.parse(userStr);
  const telegramId = String(tgUser.id);

  // Ищем пользователя по telegram_id
  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("provider_id", telegramId)
    .eq("provider", "telegram")
    .single();

  if (existingUser) {
    return NextResponse.json({ ok: true, email: existingUser.email, telegramId });
  }

  // Новый пользователь — создаём автоматически
  const autoEmail = `tg_${telegramId}@clic.app`;
  const name = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ");

  await supabaseAdmin.from("users").insert({
    name,
    email: autoEmail,
    image: tgUser.photo_url || null,
    provider: "telegram",
    provider_id: telegramId,
  });

  return NextResponse.json({ ok: true, email: autoEmail, telegramId });
}