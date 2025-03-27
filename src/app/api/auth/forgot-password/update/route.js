import { updateUserPassword } from "@/controllers/forgotPasswordController";

export async function PATCH(req, res) {
  return await updateUserPassword(req, res);
}
