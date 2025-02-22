
import { sendResetCode } from "@/controllers/forgotPasswordController";

export async function POST(req) {
  return sendResetCode(req);
}