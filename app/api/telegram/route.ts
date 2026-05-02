import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const data = await req.json();
  
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN не найден!");
    return NextResponse.json({ error: "Bot token missing" }, { status: 500 });
  }

  const secretKey = crypto.createHash("sha256").update(token).digest();
  
  const { hash, ...userData } = data;
  
  const checkString = Object.keys(userData)
    .sort()
    .map(k => `${k}=${userData[k]}`)
    .join("\n");
  
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  console.log("Полученный hash:", hash);
  console.log("Вычисленный hash:", hmac);
  console.log("Данные:", userData);
  
  if (hmac !== hash) {
    return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
  }

  const authDate = parseInt(userData.auth_date);
  if (Date.now() / 1000 - authDate > 86400) {
    return NextResponse.json({ error: "Auth data expired" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user: userData });
}