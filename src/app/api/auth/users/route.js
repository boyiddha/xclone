import { getUser } from "@/controllers/userController";

export async function GET(req) {
  return getUser(req);
}
