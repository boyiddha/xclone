import { sendResetCode } from "@/controllers/forgotPasswordController";

export async function PATCH(req) {
  return sendResetCode(req);
}
