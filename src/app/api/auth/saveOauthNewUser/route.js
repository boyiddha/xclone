import { updateUser } from "@/controllers/userController";
export const PATCH = async (request) => {
  const res = await updateUser(request);
  return res;
};
