import { getUserPostsByUserName } from "@/controllers/postController";

// GET posts by userName
export async function GET(req, { params }) {
  return getUserPostsByUserName(req, { params });
}
