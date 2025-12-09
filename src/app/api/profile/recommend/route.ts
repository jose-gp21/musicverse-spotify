// /api/profile/recommend/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { recommendForUser } from "@/lib/recommend";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const token =
      req.cookies.get("token")?.value ??
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const songs = await recommendForUser(payload.id);

    return NextResponse.json({ songs });
  } catch (err) {
    console.error("RECOMMEND ERROR:", err);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
