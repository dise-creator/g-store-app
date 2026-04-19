import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Guest" }, { status: 200 });
    }

    const { gameIds } = await req.json();

    const { error } = await supabase
      .from("users")
      .update({ wishlist: gameIds })
      .eq("email", session.user.email);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}