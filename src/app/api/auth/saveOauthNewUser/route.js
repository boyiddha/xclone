import { updateUser } from "@/controllers/userController";
export const POST = async (request) => {
  const res = await updateUser(request);
  return res;
};
