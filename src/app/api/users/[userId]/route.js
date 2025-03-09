import { getUserById } from "@/controllers/userController";

// GET User by ID
export async function GET(req, { params }) {
  return getUserById(params.userId);
}
