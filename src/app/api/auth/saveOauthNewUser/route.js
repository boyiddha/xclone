import { updateUser } from "@/controllers/userController";
import { getToken } from "next-auth/jwt";
export const POST = async (request) => {
  const res = await updateUser(request);
  return res;
};
