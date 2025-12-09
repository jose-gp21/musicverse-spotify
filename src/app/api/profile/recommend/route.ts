import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { recommendForUser } from "@/lib/recommend";

export async function GET(req: NextRequest) {
  await connectDB();
  const cookie = req.cookies.get("token")?.value;
  if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(cookie);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const songs = await recommendForUser(payload.id);
  return NextResponse.json({ songs });
}
