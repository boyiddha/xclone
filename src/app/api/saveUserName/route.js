import { NextResponse } from "next/server";

import connectDB from "@/utils/mongodb";
import { User } from "@/models/userModel";

export const POST = async (req) => {
  try {
    await connectDB();
    const { email, username } = await req.json();

    if (!email || !username) {
      return NextResponse.json(
        { message: "Email and username are required" },
        { status: 400 }
      );
    }

    // Update the user's username
    const user = await User.findOneAndUpdate(
      { email },
      { userName: username },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "username saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};
