import {
  createOrFetchConversation,
  getUserConversations,
} from "@/controllers/conversationController";

export async function POST(req) {
  return createOrFetchConversation(req);
}

export async function GET(req) {
  return getUserConversations(req);
}
