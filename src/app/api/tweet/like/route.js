import { likeOrUnlikePost } from "@/controllers/postController";
export const POST = async (request) => {
  return await likeOrUnlikePost(request);
};
