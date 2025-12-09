import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const cookie = req.cookies.get("token")?.value;

  if (!cookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = verifyToken(cookie);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await User.findById(payload.id).lean();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      favoriteGenres: user.favoriteGenres ?? [],
      favoriteSongs: user.favoriteSongs ?? []
    }
  });
}
