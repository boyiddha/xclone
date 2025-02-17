import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { setCookie } from "cookies-next";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";

// Generate JWT Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export async function POST(req, res) {
  console.log("✅ api/login call");
  const conn = await connectDB();
  const body = await req.json();
  const { email, password } = body;
  // console.log("email and password => api/login : ");
  // console.log(email, password);
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email: email });

  //console.log(user);
  if (!user) {
    // console.log("✔ user not found");
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    //console.log("✔ password not matched");
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);
  // console.log("api/login=>🔹 Sending access & refresh token:", {
  //   accessToken,
  //   refreshToken,
  // });
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
