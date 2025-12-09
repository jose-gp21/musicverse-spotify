import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDB();

  const { name, email, password, favoriteGenres } = await req.json();

  // validação simples
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Campos obrigatórios faltando" },
      { status: 400 }
    );
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Email já cadastrado" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: passwordHash, // ✅ CORREÇÃO
    favoriteGenres: favoriteGenres ?? []
  });

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    }
  });
}
