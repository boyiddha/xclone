import { returnAllPosts } from "@/controllers/postController";

export const GET = async (req) => {
  return await returnAllPosts(req);
};
