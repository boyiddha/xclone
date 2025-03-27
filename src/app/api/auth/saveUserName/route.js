import { saveUsername } from "@/controllers/userController";

export const PATCH = async (req) => {
  return saveUsername(req);
};
