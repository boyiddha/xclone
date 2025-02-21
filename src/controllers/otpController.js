import { generateOtp } from "@/services/otpService";

export const generateOtpController = async (req) => {
  try {
    const { email } = await req.json();
    const { otp, expiresAt } = await generateOtp(email);

    return new Response(JSON.stringify({ otp }), { status: 200 });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return new Response(JSON.stringify({ message: "Failed to generate OTP" }), {
      status: 500,
    });
  }
};
