import { createPost, getUserPosts } from "@/controllers/postController";

export const POST = async (request) => {
  return await createPost(request);
};

export const GET = async (req) => {
  return await getUserPosts(req);
};
