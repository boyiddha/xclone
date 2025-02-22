import { OTP } from "@/models/otpModel";

export const saveOTP = async (email, otp, expiresAt) => {
  try {
    await OTP.create({ email, otp, expiresAt });
  } catch (error) {
    console.error("Error storing OTP:", error);
    throw new Error("Failed to store OTP");
  }
};

export async function findOTP(email, otp) {
  try {
    return await OTP.findOne({ email, otp });
  } catch (error) {
    console.error("Error finding OTP:", error);
    throw new Error("Database error while fetching OTP");
  }
}

export async function deleteOTP(id) {
  try {
    return await OTP.deleteOne({ _id: id });
  } catch (error) {
    console.error("Error deleting OTP:", error);
    throw new Error("Database error while deleting OTP");
  }
}