import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email, tgId, tgName, tgPhoto } = await req.json();

  if (!tgId) {
    return NextResponse.json({ error: "Telegram ID missing" }, { status: 400 });
  }

  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (!existingUser) {
    await supabaseAdmin.from("users").insert({
      name: tgName || "Telegram User",
      email,
      image: tgPhoto || null,
      provider: "telegram",
      provider_id: String(tgId),
    });
  }

  return NextResponse.json({ ok: true, telegramId: String(tgId) });
}