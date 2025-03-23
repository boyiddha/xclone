import { getUnseenMessagesStatus } from "@/controllers/messageController";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  return await getUnseenMessagesStatus(userId); // Controller handles response
}
