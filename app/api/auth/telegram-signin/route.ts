import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { telegramId, name, username, photo, email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // Проверяем есть ли пользователь
  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (!existingUser) {
    await supabaseAdmin.from("users").insert({
      name: name || username || "Telegram User",
      email,
      image: photo || null,
      provider: "telegram",
      provider_id: String(telegramId),
    });
  }

  return NextResponse.json({ ok: true });
}