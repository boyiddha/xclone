import { handleRefreshToken } from "@/controllers/authController";

export async function POST(req, res) {
  return handleRefreshToken(req, res);
}
