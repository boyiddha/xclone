import connectDB from "@/utils/mongodb";
import { OTP } from "@/models/otpModel";
import { NextResponse } from "next/server"; // Import NextResponse

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, verificationCode } = body;

    if (!email || !verificationCode) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find OTP record
    const otp = verificationCode;
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ message: "OTP has expired" }, { status: 400 });
    }

    // OTP is valid, delete it from the database after verification (even though it will be deleted automatically after 3 minutes)
    await OTP.deleteOne({ _id: otpRecord._id });

    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
