import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre");

  const query: any = {};
  if (genre) {
    query.genres = { $in: [genre] };
  }

  const songs = await Song.find(query).lean();
  return NextResponse.json({ songs });
}
