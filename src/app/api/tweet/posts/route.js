import { createPost, getPosts } from "@/controllers/postController";

export const POST = async (request) => {
  return await createPost(request);
};

export const GET = async (req) => {
  return await getPosts(req);
};
