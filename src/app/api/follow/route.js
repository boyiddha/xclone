import { followUserController } from "@/controllers/userController";

export async function POST(req) {
  return followUserController(req);
}
