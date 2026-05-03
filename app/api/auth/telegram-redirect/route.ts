import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  const id = searchParams.get("id");
  const first_name = searchParams.get("first_name");
  const last_name = searchParams.get("last_name");
  const username = searchParams.get("username");
  const photo_url = searchParams.get("photo_url");

  if (!id) {
    return NextResponse.redirect(new URL("/signin?error=telegram", req.url));
  }

  const redirectUrl = new URL("/signin/telegram-email", req.url);
  redirectUrl.searchParams.set("tg_id", id);
  if (first_name) redirectUrl.searchParams.set("tg_name", first_name);
  if (last_name) redirectUrl.searchParams.set("tg_last", last_name);
  if (username) redirectUrl.searchParams.set("tg_username", username);
  if (photo_url) redirectUrl.searchParams.set("tg_photo", photo_url);

  return NextResponse.redirect(redirectUrl);
}