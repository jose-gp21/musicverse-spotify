import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    // ==========================
    // 1) Puxa token do cookie OU header
    // ==========================
    const cookieToken = req.cookies.get("token")?.value;
    const headerToken = req.headers.get("authorization")?.replace("Bearer ", "");

    const token = cookieToken ?? headerToken;

    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    // ==========================
    // 2) JWT obrigatório
    // ==========================
    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET");
      return NextResponse.json(
        { error: "Server misconfiguration: missing JWT_SECRET" },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
    };

    // ==========================
    // 3) Query limpa e tipada
    // ==========================
    const user = await User.findById(decoded.id).lean<IUser>();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ==========================
    // 4) Retorno seguro
    // ==========================
    
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        favoriteGenres: user.favoriteGenres ?? [],
        favoriteSongs: user.favoriteSongs ?? []
      }
    });
  } catch (err) {
    console.error("ME route error:", err);

    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}
