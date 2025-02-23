import { savePassword } from "@/controllers/userController";

export const POST = async (req) => {
  return savePassword(req);
};
