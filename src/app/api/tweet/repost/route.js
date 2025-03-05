import { repostController } from "@/controllers/postController";
export const POST = async (request) => {
  return await repostController(request);
};
