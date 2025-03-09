import { createComment, getComments } from "@/controllers/commentController";

// POST Comment
export async function POST(req) {
  return createComment(req);
}

// GET Comments
export async function GET(req) {
  return getComments(req);
}
