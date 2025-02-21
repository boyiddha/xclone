import { OTP } from "@/models/otpModel";

export const OTPRepository = async (email, otp, expiresAt) => {
  try {
    await OTP.create({ email, otp, expiresAt });
  } catch (error) {
    console.error("Error storing OTP:", error);
    throw new Error("Failed to store OTP");
  }
};
