import { searchUsers } from "@/controllers/userController";

export async function GET(req) {
  return searchUsers(req);
}
