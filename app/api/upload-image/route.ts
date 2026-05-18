import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "No URL" }, { status: 400 });

  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? "png" : "jpg";
    const filename = `games/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("image")
      .upload(filename, buffer, {
        contentType,
        upsert: true,
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data } = supabase.storage.from("image").getPublicUrl(filename);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}