import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  await connectDB();

  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // 🔥 FIX TOTAL: garante retorno único e tipado
    const user = await User.findById(decoded.id).lean<IUser>();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        favoriteGenres: user.favoriteGenres ?? [],
        favoriteSongs: user.favoriteSongs ?? [],
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}
