import { updateUser } from "@/controllers/userController";
export const POST = async (request) => {
  return updateUser(request);
};