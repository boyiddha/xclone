import { getAllUsers } from "@/controllers/userController";

// GET all users
export async function GET() {
  return getAllUsers();
}
