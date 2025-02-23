import { saveUsername } from "@/controllers/userController";

export const POST = async (req) => {
  return saveUsername(req);
};
