import { OTPRepository } from "@/repository/otpRepository";
import { randomInt } from "crypto";

export const generateOtp = async (email) => {
  const otp = randomInt(100000, 999999).toString(); // Secure OTP generation
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes expiration

  // Call the repository to store OTP in the database
  await OTPRepository(email, otp, expiresAt);

  return { otp, expiresAt };
};
