import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const telegramCookie = req.cookies.get("telegram_user")?.value;
  console.log("Cookie telegram_user:", telegramCookie);
  console.log("Все cookies:", req.cookies.getAll());

  if (!telegramCookie) {
    return NextResponse.json(
      { error: "Telegram session expired" },
      { status: 400 },
    );
  }

  const telegramUser = JSON.parse(telegramCookie);
  console.log("Telegram user:", telegramUser);

  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (!existingUser) {
    const { error: insertError } = await supabaseAdmin.from("users").insert({
      name: [telegramUser.first_name, telegramUser.last_name]
        .filter(Boolean)
        .join(" "),
      email,
      image: telegramUser.photo_url || null,
      provider: "telegram",
      provider_id: String(telegramUser.id),
    });
    console.log("Insert error:", insertError);
  }

  const response = NextResponse.json({
    ok: true,
    telegramId: String(telegramUser.id),
  });
  response.cookies.delete("telegram_user");
  return response;
}
