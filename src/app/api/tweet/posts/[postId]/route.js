import { getPostById, deletePostById } from "@/controllers/postController";

// GET Post
export async function GET(req, { params }) {
  return getPostById(req, { params });
}

// DELETE Post
export async function DELETE(req, { params }) {
  return deletePostById(req, { params });
}
