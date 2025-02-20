import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: "3m" } }, // Auto-delete after 3 minutes
});

export const OTP = mongoose.models.otps ?? mongoose.model("otps", OTPSchema);
