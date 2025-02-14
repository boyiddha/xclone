import { NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import { User } from "@/models/userModel";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and code are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user || !user.forgetPasswordCode || !user.forgetPasswordExpiresAt) {
      return NextResponse.json(
        { message: "Invalid reset code" },
        { status: 400 }
      );
    }

    const isCodeExpired = new Date() > new Date(user.forgetPasswordExpiresAt);
    if (isCodeExpired) {
      return NextResponse.json(
        { message: "Reset code has expired" },
        { status: 400 }
      );
    }

    if (user.forgetPasswordCode !== code) {
      return NextResponse.json(
        { message: "Code Did't Match" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Code verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying reset code:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
