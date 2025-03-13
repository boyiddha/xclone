import { getUserByIdentifier } from "@/controllers/userController";
import { updateUserProfile } from "@/controllers/userController";

// GET User by ID
export async function GET(req, { params }) {
  const { identifier } = await params;
  return getUserByIdentifier(identifier);
}

export async function PATCH(req, { params }) {
  return updateUserProfile(req, params);
}
