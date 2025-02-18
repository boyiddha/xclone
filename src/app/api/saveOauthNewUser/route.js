import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/utils/mongodb";
import { User } from "@/models/userModel";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  try {
    console.log("api call ==========================================");
    // Parse request body
    const { dob, password, username } = await request.json();

    // Get token from request
    const token = await getToken({
      req: request, // Use "req" instead of "request" for getToken
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get the user's email from the token
    const email = token.email;

    // Connect to MongoDB
    await connectDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    // Find and update the user in the database
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Find user by email
      { dob, password: hashedPassword, userName: username }, // Update fields
      { new: true, runValidators: true } // Return updated user and validate fields
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found!" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 250 }
    );
  }
};
