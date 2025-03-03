import { repostWithoutQuote } from "@/controllers/postController";
export const POST = async (request) => {
  return await repostWithoutQuote(request);
};
