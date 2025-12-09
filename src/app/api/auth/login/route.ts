import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  // 🔥 CORREÇÃO: usar o campo correto
  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  const token = signToken(user._id.toString());

  const res = NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    }
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  });

  return res;
}
