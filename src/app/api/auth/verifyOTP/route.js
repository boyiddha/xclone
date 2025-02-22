import { verifyOTP } from "@/controllers/otpController";

export async function POST(req) {
  return verifyOTP(req);
}
