import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { setCookie } from "cookies-next";
import { User } from "@/model/user-model";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";

// Generate JWT Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10s" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "25s" }
  );

  return { accessToken, refreshToken };
};

export async function POST(req, res) {
  const conn = await dbConnect();
  const body = await req.json();
  const { email, password } = body;
  //console.log(email, password);
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email: email });

  console.log(user);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Return a response with the refresh token in a cookie
  const response = NextResponse.json(
    {
      accessToken,
      refreshToken,
      expiresIn: 10, // 10 seconds
      userInfo: { email: user.email },
    },
    { status: 200 }
  );

  // Set the refresh token as an HttpOnly cookie
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/", // Set the cookie for the entire domain
  });
  return response;
}
