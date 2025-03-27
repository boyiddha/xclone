import { likeOrUnlikePost } from "@/controllers/postController";
export const PATCH = async (request) => {
  return await likeOrUnlikePost(request);
};
