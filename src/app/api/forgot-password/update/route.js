import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/utils/mongodb";
import { User } from "@/models/userModel";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email and new password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    //console.log("✅ user is: ", user);
    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 400 });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Remove the reset code after password is changed
    user.forgetPasswordCode = null;
    user.forgetPasswordExpiresAt = null;

    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
