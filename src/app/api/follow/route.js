import { followUserController } from "@/controllers/userController";

export async function PATCH(req) {
  return followUserController(req);
}
