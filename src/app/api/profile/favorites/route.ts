// /api/profile/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { songId, action } = await req.json();
    if (!songId || !action)
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const user = await User.findById(payload.id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Normaliza array
    const favorites = user.favoriteSongs.map((id: any) => id.toString());

    if (action === "add") {
      if (!favorites.includes(songId)) {
        user.favoriteSongs.push(songId);
      }
    }

    if (action === "remove") {
      user.favoriteSongs = favorites.filter((id: any) => id !== songId);
    }

    await user.save();

    return NextResponse.json({
      favoriteSongs: user.favoriteSongs.map((id: any) => id.toString())
    });
  } catch (err) {
    console.error("FAVORITES ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
