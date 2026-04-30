import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { code, total } = await req.json();

  const { data: promo, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (error || !promo) {
    return NextResponse.json({ ok: false, message: "Промокод не найден" });
  }

  if (promo.used_count >= promo.max_uses) {
    return NextResponse.json({ ok: false, message: "Промокод уже использован" });
  }

  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ ok: false, message: "Промокод истёк" });
  }

  const discount =
    promo.type === "percent"
      ? Math.round(total * promo.value / 100)
      : promo.value;

  return NextResponse.json({
    ok: true,
    promo_id: promo.id,
    type: promo.type,
    value: promo.value,
    discount,
  });
}