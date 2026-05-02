import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const hash = searchParams.get("hash");
  const id = searchParams.get("id");
  const first_name = searchParams.get("first_name");
  const last_name = searchParams.get("last_name");
  const username = searchParams.get("username");
  const photo_url = searchParams.get("photo_url");
  const auth_date = searchParams.get("auth_date");

  if (!hash || !id || !auth_date) {
    return NextResponse.redirect(new URL("/signin?error=telegram", req.url));
  }

  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const secretKey = crypto.createHash("sha256").update(token).digest();

  const params: Record<string, string> = { id, auth_date };
  if (first_name) params.first_name = first_name;
  if (last_name) params.last_name = last_name;
  if (username) params.username = username;
  if (photo_url) params.photo_url = photo_url;

  const checkString = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  if (hmac !== hash) {
    return NextResponse.redirect(
      new URL("/signin?error=invalid_hash", req.url),
    );
  }

  const telegramData = JSON.stringify({
    id,
    first_name,
    last_name,
    username,
    photo_url,
  });
  const response = NextResponse.redirect(
    new URL("/signin/telegram-email", req.url),
  );
  response.cookies.set("telegram_user", telegramData, {
    httpOnly: true,
    maxAge: 600,
    path: "/",
  });

  return response;
}
