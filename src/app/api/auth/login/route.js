import { loginController } from "@/controllers/authController";

export const POST = async (req) => {
  return loginController(req);
};
