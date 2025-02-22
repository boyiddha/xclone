import { generateOtpController } from "@/controllers/otpController";

export async function POST(req) {
  return generateOtpController(req);
}
