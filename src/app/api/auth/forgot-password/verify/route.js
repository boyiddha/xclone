import { verifyResetCode } from "@/controllers/forgotPasswordController";

export async function POST(req) {
  return verifyResetCode(req);
}
