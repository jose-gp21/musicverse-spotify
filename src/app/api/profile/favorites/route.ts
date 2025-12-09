import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectDB();
  const cookie = req.cookies.get("token")?.value;
  if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(cookie);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { songId, action } = await req.json();

  const user = await User.findById(payload.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const favorites = user.favoriteSongs.map((id: any) => String(id));

  if (action === "add" && !favorites.includes(songId)) {
    user.favoriteSongs.push(songId);
  } else if (action === "remove") {
    user.favoriteSongs = user.favoriteSongs.filter((id: any) => String(id) !== songId);
  }

  await user.save();

  return NextResponse.json({
    favoriteSongs: user.favoriteSongs
  });
}
