
import { NextResponse } from "next/server";
import { generateOtp, verifyOTPService } from "@/services/otpService";

export const generateOtpController = async (req) => {
  try {
    const { email } = await req.json();
    const { otp,expiresAt } = await generateOtp(email);

    return NextResponse.json({ otp }, { status: 200 });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return NextResponse.json(
      { message: "Failed to generate OTP" },
      { status: 500 }
    );
  }
};

export async function verifyOTP(req) {
  try {
    const body = await req.json();
    const { email, verificationCode } = body;

    if (!email || !verificationCode) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const result = await verifyOTPService(email, verificationCode);

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

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
