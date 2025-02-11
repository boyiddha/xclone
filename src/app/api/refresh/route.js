import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";
import { NextResponse } from "next/server";

// Function to generate a new access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10s" } // Access token expires in 15 minutes
  );
};
export async function POST(req, res) {
  const body = await req.json();

  // Try getting the refresh token from the request body or cookies
  const refreshToken =
    body.refreshToken || getCookie("refreshToken", { req, res });

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token missing" },
      { status: 401 }
    );
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Generate a new access token
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
    });

    // 15 min expiry
    return NextResponse.json({ accessToken: newAccessToken, expiresIn: 10 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired refresh token" },
      { status: 403 }
    );
  }
}
