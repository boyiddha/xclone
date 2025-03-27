import { savePassword } from "@/controllers/userController";

export const PATCH = async (req) => {
  return savePassword(req);
};
