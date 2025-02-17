import { NextResponse } from "next/server";
import { User } from "@/models/userModel";
import connectDB from "@/utils/mongodb";

export async function POST(req) {
  await connectDB(); // Ensure MongoDB connection is established

  try {
    // Parse request body
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("-password").lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
