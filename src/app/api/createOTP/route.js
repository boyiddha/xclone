import { randomInt } from "crypto";
import connectDB from "@/utils/mongodb";
import { OTP } from "@/models/otp";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email } = body;
    const otp = randomInt(100000, 999999).toString(); // Secure OTP generation
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes expiration

    // Store OTP in MongoDB

    await OTP.create({ email, otp, expiresAt });

    // Return OTP to the client
    return new Response(JSON.stringify({ otp }), { status: 200 });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return new Response(JSON.stringify({ message: "Failed to generate OTP" }), {
      status: 500,
    });
  }
}
