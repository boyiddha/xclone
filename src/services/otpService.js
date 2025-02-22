import { saveOTP, findOTP, deleteOTP } from "@/repositories/otpRepository";
import {generateSecureOTP} from "@/utils/randomUtils";
import {getExpirationTime} from "@/utils/expiresTimeUtils";
import { OTP_EXPIRATION_TIME, OTP_LENGTH } from "@/constants/security";

export const generateOtp = async (email) => {
  const otp = generateSecureOTP(OTP_LENGTH);  // Secure 6 dgt OTP generation
  const expiresAt = getExpirationTime(OTP_EXPIRATION_TIME)// 3 minutes expiration

  // Call the repository to store OTP in the database
  await saveOTP(email, otp, expiresAt);

  return { otp, expiresAt };
};

export async function verifyOTPService(email, otp) {
  try {
    const otpRecord = await findOTP(email, otp);

    if (!otpRecord) {
      return { success: false, message: "Invalid OTP" };
    }

    if (new Date() > otpRecord.expiresAt) {
      return { success: false, message: "OTP has expired" };
    }

    // Delete OTP after successful verification
    await deleteOTP(otpRecord._id);

    return { success: true };
  } catch (error) {
    console.error("Error in OTP service:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

