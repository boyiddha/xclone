import { NextResponse } from "next/server";
import { User } from "@/models/userModel";

export async function GET() {
  try {
    const users = await User.find({}, "fullName userName image");
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}
