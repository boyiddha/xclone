

import { updateUserPassword } from "@/controllers/forgotPasswordController";

export async function POST(req, res) {
  return await updateUserPassword(req, res);
}
